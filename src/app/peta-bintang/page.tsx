
'use client';

import { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link';
import Image from 'next/image';
import heic2any from 'heic2any';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Home, Loader2, Sparkles, Star, Trash2, UploadCloud, CalendarIcon, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

type Memory = {
  id: string;
  title: string;
  date: string;
  story: string;
  photoUrl: string | null;
  position: { x: number; y: number };
  parentId: string | null;
  createdAt: any;
};

const StarComponent = ({ memory, onClick, isSelected, parentPosition }: { memory: Memory, onClick: () => void, isSelected: boolean, parentPosition: {x: number, y: number} | null }) => (
  <>
    {parentPosition && (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <line
          x1={`${memory.position.x}%`}
          y1={`${memory.position.y}%`}
          x2={`${parentPosition.x}%`}
          y2={`${parentPosition.y}%`}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>
    )}
    <button
      style={{ left: `${memory.position.x}%`, top: `${memory.position.y}%` }}
      className={cn(
        'absolute w-4 h-4 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 flex items-center justify-center',
        isSelected ? 'scale-150 shadow-[0_0_20px_theme(colors.yellow.300)] bg-yellow-300' : 'hover:scale-125 hover:shadow-[0_0_15px_white]'
      )}
      onClick={onClick}
    >
      <div className={cn("absolute w-full h-full bg-white rounded-full", isSelected ? 'animate-ping-slow opacity-75 bg-yellow-300' : 'group-hover:animate-ping-slow')}></div>
    </button>
  </>
);

export default function PetaBintangPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [newMemoryPos, setNewMemoryPos] = useState<{ x: number; y: number } | null>(null);
  const [formState, setFormState] = useState<{ title: string; date: string; story: string; parentId: string | null; }>({ title: '', date: '', story: '', parentId: null });
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });

    if (!isAuthenticated) return;
    const q = query(collection(db, 'memories'));
    const unsubFirestore = onSnapshot(q, (snapshot) => {
      const fetchedMemories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Memory));
      fetchedMemories.sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));
      setMemories(fetchedMemories);
    });

    return () => {
      unsubAuth();
      unsubFirestore && unsubFirestore();
    };
  }, [isAuthenticated]);
  
  const parentMemories = memories.reduce((acc, memory) => {
      if (memory.parentId && memories.find(m => m.id === memory.parentId)) {
          acc[memory.id] = memories.find(m => m.id === memory.parentId)!.position;
      }
      return acc;
  }, {} as Record<string, {x: number, y: number}>);

  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!skyRef.current) return;
    const target = e.target as HTMLElement;
    // Prevent opening form if a star or button is clicked
    if (target !== skyRef.current) return;
    
    const rect = skyRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setNewMemoryPos({ x, y });
    setFormState({ title: '', date: '', story: '', parentId: null });
    setPhotoFile(null);
    setIsFormOpen(true);
  };

  const handleStarClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsViewOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!formState.title || !newMemoryPos) return;
    setIsLoading(true);

    let uploadedPhotoUrl: string | null = null;
    if (photoFile) {
      try {
        toast({ title: 'Mengupload foto...' });
        let fileToUpload: Blob = photoFile;
        if (photoFile.name.toLowerCase().match(/\.(heic|heif)$/)) {
            const convertedBlob = await heic2any({ blob: photoFile, toType: 'image/jpeg', quality: 0.8 });
            fileToUpload = convertedBlob as Blob;
        }
        const photoStorageRef = storageRef(storage, `memory_photos/${Date.now()}_${photoFile.name}`);
        await uploadBytes(photoStorageRef, fileToUpload);
        uploadedPhotoUrl = await getDownloadURL(photoStorageRef);
      } catch (error) {
        console.error("Photo upload error:", error);
        toast({ variant: 'destructive', title: 'Gagal upload foto.' });
        setIsLoading(false);
        return;
      }
    }

    try {
      await addDoc(collection(db, 'memories'), {
        title: formState.title,
        date: formState.date,
        story: formState.story,
        photoUrl: uploadedPhotoUrl,
        position: newMemoryPos,
        parentId: formState.parentId || null,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Bintang kenangan berhasil ditambahkan!' });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding memory:", error);
      toast({ variant: 'destructive', title: 'Gagal menyimpan kenangan.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
      if (!window.confirm("Yakin mau hapus bintang kenangan ini selamanya?")) return;
      setIsLoading(true);
      try {
          await deleteDoc(doc(db, "memories", id));
          toast({ title: "Kenangan telah dihapus."});
          setIsViewOpen(false);
          setSelectedMemory(null);
      } catch (error) {
          console.error("Error deleting memory:", error);
          toast({ variant: 'destructive', title: 'Gagal menghapus kenangan.' });
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <>
      <style jsx>{`
        .night-sky {
          background: #00000c;
          background-image:
            radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
            radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
            radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
            radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
          background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
          background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
        }
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="relative min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-center">
            <h1 className="text-2xl font-bold font-display text-white/90" style={{textShadow: '0 0 10px rgba(255,255,255,0.3)'}}>Peta Bintang Kenangan</h1>
            <Link href="/" className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                <Home size={16}/> Kembali
            </Link>
        </header>

        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full h-[80vh] max-w-7xl mx-auto rounded-2xl overflow-hidden relative night-sky border border-white/10" ref={skyRef} onClick={handleSkyClick}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-white/30 text-lg">Klik di mana saja untuk menambah bintang kenangan baru...</p>
                </div>
                {memories.map(memory => (
                    <StarComponent 
                        key={memory.id} 
                        memory={memory} 
                        onClick={(e) => { e.stopPropagation(); handleStarClick(memory); }}
                        isSelected={selectedMemory?.id === memory.id}
                        parentPosition={parentMemories[memory.id] || null}
                    />
                ))}
            </div>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Bintang Kenangan Baru</DialogTitle>
              <DialogDescription>Abadikan momen spesialmu di langit malam ini.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Judul Kenangan (e.g., Kencan Pertama)" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} />
              <Input type="date" value={formState.date} onChange={e => setFormState({...formState, date: e.target.value})} />
              <Textarea placeholder="Ceritakan kenanganmu di sini..." value={formState.story} onChange={e => setFormState({...formState, story: e.target.value})} />
              <Select 
                onValueChange={value => setFormState({...formState, parentId: value === '_none_' ? null : value })} 
                value={formState.parentId || '_none_'}
              >
                <SelectTrigger><SelectValue placeholder="Hubungkan ke kenangan lain (opsional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none_">Tidak terhubung</SelectItem>
                  {memories.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                </SelectContent>
              </Select>
              <input type="file" ref={fileInputRef} onChange={e => setPhotoFile(e.target.files ? e.target.files[0] : null)} className="hidden" accept="image/*,.heic,.heif" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <UploadCloud className="mr-2" /> {photoFile ? `File: ${photoFile.name}` : 'Upload Foto'}
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={handleFormSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Letakkan Bintang
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
              {selectedMemory && (
                  <>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{selectedMemory.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 pt-1"><CalendarIcon size={14} /> {new Date(selectedMemory.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                        {selectedMemory.photoUrl && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                <Image src={selectedMemory.photoUrl} alt={selectedMemory.title} layout="fill" objectFit="cover" />
                            </div>
                        )}
                        <p className="text-foreground/90 whitespace-pre-wrap">{selectedMemory.story}</p>
                    </div>
                    <DialogFooter className="justify-between">
                        <Button variant="destructive" onClick={() => handleDeleteMemory(selectedMemory.id)} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        </Button>
                        <DialogClose asChild>
                            <Button>Tutup</Button>
                        </DialogClose>
                    </DialogFooter>
                  </>
              )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
