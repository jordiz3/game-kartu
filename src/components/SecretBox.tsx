'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { Send, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { cn } from '../lib/utils';
import Link from 'next/link';
import { useToast } from "../hooks/use-toast";
import { suggestQuestion } from '../ai/flows/suggest-question-flow';


type Question = {
  id: string;
  question: string;
  answer: string;
  isAnswered: boolean;
  sender: 'cipa' | 'jojo';
  recipient: 'cipa' | 'jojo';
  createdAt: any;
};

type AnswerInputs = {
  [key: string]: string;
};

export default function SecretBox() {
  const [currentUser, setCurrentUser] = useState<'cipa' | 'jojo'>('cipa');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questionInput, setQuestionInput] = useState('');
  const [answerInputs, setAnswerInputs] = useState<AnswerInputs>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous sign-in failed:', error);
          toast({
            variant: "destructive",
            title: "Gagal Autentikasi",
            description: "Tidak bisa masuk sebagai pengguna anonim. Coba refresh halaman.",
          })
        });
      }
    });
    return () => unsubscribeAuth();
  }, [toast]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const questionsCollectionRef = collection(db, 'secret_box');
    const q = query(questionsCollectionRef);

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const fetchedQuestions = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Question)
      );
      // Sort client-side to avoid needing a composite index in Firestore
      fetchedQuestions.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setAllQuestions(fetchedQuestions);
    }, (error) => {
        console.error("Snapshot error: ", error);
        toast({
            variant: "destructive",
            title: "Gagal memuat data",
            description: "Tidak bisa mengambil data pertanyaan dari server.",
        });
    });

    return () => unsubscribeSnapshot();
  }, [isAuthenticated, toast]);

  const handleAnswerInputChange = (id: string, value: string) => {
    setAnswerInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSuggestQuestion = async () => {
    setIsSuggesting(true);
    try {
      const result = await suggestQuestion({
        currentUser: currentUser,
        recipient: currentUser === 'cipa' ? 'jojo' : 'cipa',
      });
      setQuestionInput(result.suggestedQuestion);
    } catch (error) {
      console.error('Error suggesting question:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Dapat Saran',
        description: 'Lagi nggak dapet ide nih, coba tanya manual dulu ya.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const addQuestion = async () => {
    if (!questionInput.trim()) {
      toast({
        title: 'Jangan Kosong Dong!',
        description: 'Pertanyaannya tidak boleh kosong ya.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const questionsCollectionRef = collection(db, 'secret_box');
      await addDoc(questionsCollectionRef, {
        question: questionInput,
        answer: '',
        isAnswered: false,
        sender: currentUser,
        recipient: currentUser === 'cipa' ? 'jojo' : 'cipa',
        createdAt: serverTimestamp(),
      });
      setQuestionInput('');
      toast({
        title: 'Terkirim!',
        description: 'Pertanyaan rahasiamu berhasil dikirim.',
      });
    } catch (error) {
      console.error("Error adding question: ", error);
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Tidak dapat mengirim pertanyaan. Mungkin ada masalah dengan koneksi atau izin.",
      })
    }
  };

  const answerQuestion = async (id: string) => {
    const answerText = answerInputs[id]?.trim();
    if (!answerText) {
      toast({
        title: 'Jangan Kosong Dong!',
        description: 'Jawabannya tidak boleh kosong ya.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const docRef = doc(db, 'secret_box', id);
      await updateDoc(docRef, {
        answer: answerText,
        isAnswered: true,
      });
      handleAnswerInputChange(id, '');
       toast({
        title: 'Berhasil Dijawab!',
        description: 'Jawabanmu telah disimpan.',
      });
    } catch (error) {
       console.error("Error answering question: ", error);
       toast({
        variant: "destructive",
        title: "Gagal Menjawab",
        description: "Tidak dapat menyimpan jawaban. Mungkin ada masalah dengan koneksi atau izin.",
      })
    }
  };
  
  const unansweredForMe = allQuestions.filter(
    (q) => q.recipient === currentUser && !q.isAnswered
  );
  const answeredConvos = allQuestions.filter((q) => q.isAnswered);

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="font-handwriting text-5xl md:text-6xl text-pink-500">
          Kotak Rahasia
        </h1>
        <p className="text-gray-500 mt-2">Untuk Cipa & Jojo ♥</p>
      </header>

      <div className="flex justify-center mb-8 bg-white p-1.5 rounded-full shadow-inner">
        <button
          onClick={() => setCurrentUser('cipa')}
          className={cn(
            'user-toggle w-1/2 py-2 rounded-full font-semibold',
            { active: currentUser === 'cipa' }
          )}
        >
          Aku Cipa
        </button>
        <button
          onClick={() => setCurrentUser('jojo')}
          className={cn(
            'user-toggle w-1/2 py-2 rounded-full font-semibold',
            { active: currentUser === 'jojo' }
          )}
        >
          Aku Jojo
        </button>
      </div>

      <div id="main-view">
        <section id="ask-form-section" className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-4">
            Tanya Sesuatu ke{' '}
            <span className="text-pink-500">
              {currentUser === 'cipa' ? 'Jojo' : 'Cipa'}
            </span>
            ...
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <Textarea
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              rows={4}
              placeholder="Ketik pertanyaan rahasiamu di sini..."
              className="focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition"
            />
             <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                onClick={handleSuggestQuestion}
                variant="outline"
                className="btn w-full sm:w-auto"
                disabled={isSuggesting}
              >
                {isSuggesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Sarankan Pertanyaan
              </Button>
              <Button
                onClick={addQuestion}
                className="btn w-full sm:flex-grow bg-pink-500 text-white font-bold py-3 text-base hover:bg-pink-600"
              >
                Kirim Pertanyaan Rahasia
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section id="unanswered-section" className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-4">
            💌 Pertanyaan Untukmu
          </h2>
          <div className="space-y-4">
            {unansweredForMe.length === 0 ? (
              <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
                Aman, nggak ada pertanyaan baru buatmu!
              </div>
            ) : (
              unansweredForMe.map((q) => (
                <div key={q.id} className="card-enter bg-white p-5 rounded-xl shadow-md">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Pertanyaan dari{' '}
                      <span className="font-bold">
                        {q.sender === 'cipa' ? 'Cipa' : 'Jojo'}
                      </span>
                      ...
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {q.question}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Textarea
                      value={answerInputs[q.id] || ''}
                      onChange={(e) => handleAnswerInputChange(q.id, e.target.value)}
                      placeholder="Tulis jawabanmu di sini..."
                      className="focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition"
                    />
                    <Button
                      onClick={() => answerQuestion(q.id)}
                      className="btn w-full mt-2 bg-green-500 text-white font-bold py-2 text-base hover:bg-green-600"
                    >
                      Jawab
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="answered-section">
          <h2 className="text-2xl font-bold text-center mb-4">
            💬 Obrolan Kita
          </h2>
          <div className="space-y-4">
            {answeredConvos.length === 0 ? (
              <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
                Belum ada obrolan yang selesai.
              </div>
            ) : (
              answeredConvos.map((q) => (
                <div key={q.id} className="card-enter bg-white p-5 rounded-xl shadow-md">
                  <div className="border-b pb-3 mb-3">
                    <p className="text-gray-500 text-sm">
                      Pertanyaan dari{' '}
                      <span className="font-bold">
                        {q.sender === 'cipa' ? 'Cipa' : 'Jojo'}
                      </span>
                      :
                    </p>
                    <p className="text-lg text-gray-700">{q.question}</p>
                  </div>
                  <div>
                    <p className="text-pink-500 font-semibold text-sm">
                      Jawaban dari{' '}
                      <span className="font-bold">
                        {q.recipient === 'cipa' ? 'Cipa' : 'Jojo'}
                      </span>
                      :
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {q.answer}
                    </p>
                  </div>
                  <div className="text-right text-xs text-green-500 mt-2 flex items-center justify-end">
                    <CheckCircle className="mr-1 h-3 w-3" /> Sudah Dijawab
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <footer className="text-center mt-12 border-t pt-4">
        <Link href="/wishlist" className="text-pink-500 hover:underline">
          Lihat Wishlist Date Kita 💕
        </Link>
        <span className="mx-2 text-gray-400">|</span>
        <Link href="/deep-talk" className="text-pink-500 hover:underline">
          Main Kartu Deep Talk 🎴
        </Link>
        <span className="mx-2 text-gray-400">|</span>
        <Link href="/truth-or-dare" className="text-pink-500 hover:underline">
          Main Truth or Dare 🔥
        </Link>
      </footer>
    </div>
  );
}
