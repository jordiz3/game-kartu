
"use client";

import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { Question, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, CheckCircle2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SecretBox() {
  const [currentUser, setCurrentUser] = useState<User>('cipa');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth || !db) {
      setFirebaseError("Could not initialize Firebase. Please ensure your `.env.local` file is set up with valid credentials.");
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error: any) {
          console.error("Anonymous sign-in failed:", error);
          if (error.code === 'auth/configuration-not-found') {
            setFirebaseError('Anonymous sign-in is not enabled. Please go to your Firebase console, navigate to Authentication > Sign-in method, and enable the Anonymous provider.');
          } else {
            setFirebaseError(`An error occurred during authentication: ${error.message}. Please check your Firebase setup and the browser console.`);
          }
          setLoading(false);
        }
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !db) {
      // Wait for authentication or for a firebase error.
      // If we are authenticated, loading will be set to false inside onSnapshot.
      return;
    }

    const questionsCollectionRef = collection(db, 'secret_box');
    const q = query(questionsCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const fetchedQuestions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Question));
      setQuestions(fetchedQuestions);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching questions:", error);
      setFirebaseError(`Error fetching data: ${error.message}`);
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [isAuthenticated]);

  const recipientName = useMemo(() => currentUser === 'cipa' ? 'Jojo' : 'Cipa', [currentUser]);

  const unansweredQuestions = useMemo(() =>
    questions.filter(q => q.recipient === currentUser && !q.isAnswered),
    [questions, currentUser]
  );

  const answeredQuestions = useMemo(() =>
    questions.filter(q => q.isAnswered),
    [questions]
  );

  const handleSendQuestion = async (questionText: string) => {
    if (!db) return;
    if (!questionText.trim()) {
      alert('Pertanyaannya jangan kosong dong!');
      return;
    }
    try {
      await addDoc(collection(db, 'secret_box'), {
        question: questionText,
        answer: "",
        isAnswered: false,
        sender: currentUser,
        recipient: currentUser === 'cipa' ? 'jojo' : 'cipa',
        createdAt: serverTimestamp(),
      });
      alert('Pertanyaan rahasia terkirim!');
    } catch (error) {
      console.error("Error sending question:", error);
      alert('Gagal mengirim pertanyaan. Coba lagi.');
    }
  };

  const handleAnswerQuestion = async (id: string, answerText: string) => {
    if (!db) return;
    if (!answerText.trim()) {
      alert('Jawabannya jangan kosong dong!');
      return;
    }
    try {
      const questionDocRef = doc(db, 'secret_box', id);
      await updateDoc(questionDocRef, {
        answer: answerText,
        isAnswered: true,
      });
    } catch (error) {
      console.error("Error answering question:", error);
      alert('Gagal menyimpan jawaban. Coba lagi.');
    }
  };

  if (firebaseError) {
    return (
      <div className="container mx-auto max-w-2xl p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="font-headline text-5xl md:text-6xl text-primary">Kotak Rahasia</h1>
          <p className="text-gray-500 mt-2">Untuk Cipa & Jojo ♥</p>
        </header>
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Firebase Configuration Error</AlertTitle>
          <AlertDescription>
            {firebaseError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="font-headline text-5xl md:text-6xl text-primary">Kotak Rahasia</h1>
        <p className="text-gray-500 mt-2">Untuk Cipa & Jojo ♥</p>
      </header>

      <div className="flex justify-center mb-8 bg-white p-1.5 rounded-full shadow-inner">
        <button onClick={() => setCurrentUser('cipa')} className={cn('user-toggle w-1/2 py-2 rounded-full font-semibold transition-all duration-300', currentUser === 'cipa' && 'bg-primary text-primary-foreground shadow-md')}>Aku Cipa</button>
        <button onClick={() => setCurrentUser('jojo')} className={cn('user-toggle w-1/2 py-2 rounded-full font-semibold transition-all duration-300', currentUser === 'jojo' && 'bg-primary text-primary-foreground shadow-md')}>Aku Jojo</button>
      </div>

      <main>
        <QuestionForm recipientName={recipientName} onSendQuestion={handleSendQuestion} />
        
        <QuestionList
          title="💌 Pertanyaan Untukmu"
          questions={unansweredQuestions}
          onAnswer={handleAnswerQuestion}
          type="unanswered"
          loading={loading}
          emptyMessage="Aman, nggak ada pertanyaan baru buatmu!"
        />
        
        <QuestionList
          title="💬 Obrolan Kita"
          questions={answeredQuestions}
          type="answered"
          loading={loading}
          emptyMessage="Belum ada obrolan yang selesai."
        />
      </main>
    </div>
  );
}

function QuestionForm({ recipientName, onSendQuestion }: { recipientName: string, onSendQuestion: (text: string) => void }) {
  const [questionText, setQuestionText] = useState('');

  const handleSubmit = () => {
    onSendQuestion(questionText);
    setQuestionText('');
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-center mb-4">Tanya Sesuatu ke <span className="text-primary">{recipientName}</span>...</h2>
      <Card>
        <CardContent className="p-6">
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={4}
            placeholder="Ketik pertanyaan rahasiamu di sini..."
            className="focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          />
          <Button onClick={handleSubmit} className="w-full mt-4 font-bold text-base py-6 hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-300">
            Kirim Pertanyaan Rahasia <Send className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function QuestionList({ title, questions, onAnswer, type, loading, emptyMessage }: { title: string, questions: Question[], onAnswer?: (id: string, text: string) => void, type: 'answered' | 'unanswered', loading: boolean, emptyMessage: string }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
      <div className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </>
        ) : questions.length === 0 ? (
          <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">{emptyMessage}</div>
        ) : (
          questions.map(q => <QuestionCard key={q.id} question={q} type={type} onAnswer={onAnswer} />)
        )}
      </div>
    </section>
  );
}

function QuestionCard({ question, type, onAnswer }: { question: Question, type: 'answered' | 'unanswered', onAnswer?: (id: string, text: string) => void }) {
  const [answerText, setAnswerText] = useState('');

  const handleAnswer = () => {
    if (onAnswer) {
      onAnswer(question.id, answerText);
    }
  };

  const senderName = question.sender.charAt(0).toUpperCase() + question.sender.slice(1);
  const recipientName = question.recipient.charAt(0).toUpperCase() + question.recipient.slice(1);

  return (
    <Card className="animate-card-enter overflow-hidden">
      <CardContent className="p-5">
        {type === 'unanswered' ? (
          <>
            <div>
              <p className="text-gray-500 text-sm">Pertanyaan dari <span className="font-bold">{senderName}</span>...</p>
              <p className="text-lg font-bold text-gray-800">{question.question}</p>
            </div>
            <div className="mt-4">
              <Textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Tulis jawabanmu di sini..."
                className="focus:ring-2 focus:ring-green-500/50"
              />
              <Button onClick={handleAnswer} variant="secondary" className="w-full mt-2 bg-green-500 text-white font-bold py-5 text-base hover:bg-green-600">Jawab</Button>
            </div>
          </>
        ) : (
          <>
            <div className="border-b pb-3 mb-3">
              <p className="text-gray-500 text-sm">Pertanyaan dari <span className="font-bold">{senderName}</span>:</p>
              <p className="text-lg text-gray-700">{question.question}</p>
            </div>
            <div>
              <p className="text-primary font-semibold text-sm">Jawaban dari <span className="font-bold">{recipientName}</span>:</p>
              <p className="text-lg font-semibold text-gray-900">{question.answer}</p>
            </div>
            <div className="text-right text-xs text-green-500 mt-2 flex items-center justify-end">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Sudah Dijawab
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
