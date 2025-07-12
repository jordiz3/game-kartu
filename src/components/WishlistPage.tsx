
'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import {
  Plus,
  Heart,
  CheckCheck,
  MapPin,
  FilePenLine,
  Trash2,
  CheckCircle2,
  Undo2,
  Camera,
  Star,
  Loader2,
  Home,
} from 'lucide-react';

type WishlistItem = {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  isHighPriority: boolean;
  isCompleted: boolean;
  photoUrl: string | null;
  ratings: { name: string; rating: number }[];
  createdAt: any;
};

type ItemStatus = {
  isLoading?: boolean;
  isSaving?: boolean;
};

const CATEGORIES = [
  'Kuliner',
  'Petualangan',
  'Seni & Budaya',
  'Wisata',
  'Santai',
  'Di Rumah',
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isHighPriority, setIsHighPriority] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [currentTab, setCurrentTab] = useState('impian');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus>>({});

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Auth failed', error);
          toast({ variant: 'destructive', title: 'Autentikasi Gagal' });
        });
      }
    });
    return () => unsubscribeAuth();
  }, [toast]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, 'wishlist_dates'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as WishlistItem)
      );
      items.sort((a, b) => (a.isCompleted ? 1 : -1) - (b.isCompleted ? 1 : -1) || (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setWishlist(items);
    }, (error) => {
      console.error(error);
      toast({ variant: 'destructive', title: 'Gagal memuat data.' });
    });

    return () => unsubscribe();
  }, [isAuthenticated, toast]);
  
  const setItemLoading = (id: string, isLoading: boolean) => {
    setItemStatuses(prev => ({ ...prev, [id]: { ...prev[id], isLoading }}));
  }

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setCategory('');
    setDescription('');
    setIsHighPriority(false);
    setPhotoFile(null);
  };

  const handleAddItem = async () => {
    if (!title.trim() || !isAuthenticated) {
      toast({ variant: 'destructive', title: 'Judul jangan kosong dan pastikan Anda sudah login.' });
      return;
    }
    setIsAdding(true);
    
    try {
      let uploadedPhotoUrl: string | null = null;
      if (photoFile) {
        toast({ title: 'Mengupload foto...' });
        const storage = getStorage();
        const imageRef = storageRef(storage, `wishlist_photos/${Date.now()}-${photoFile.name}`);
        const uploadResult = await uploadBytes(imageRef, photoFile);
        uploadedPhotoUrl = await getDownloadURL(uploadResult.ref);
      }
      
      await addDoc(collection(db, 'wishlist_dates'), {
        title, location, category, description, isHighPriority,
        photoUrl: uploadedPhotoUrl,
        isCompleted: false,
        ratings: [],
        createdAt: serverTimestamp(),
      });
      
      toast({ title: 'Wishlist berhasil ditambah!' });
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Gagal menambah wishlist.', description: (error as Error).message });
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleToggleComplete = async (item: WishlistItem) => {
    setItemLoading(item.id, true);
    try {
      const docRef = doc(db, 'wishlist_dates', item.id);
      await updateDoc(docRef, { isCompleted: !item.isCompleted });
      toast({
          title: item.isCompleted ? 'Dikembalikan ke wishlist.' : 'Selamat, date kelakon!',
          description: item.isCompleted ? 'Siap untuk direcanakan lagi!' : 'Jangan lupa kasih rating & foto ya.',
        });
    } catch (error) {
        console.error("Error toggling complete:", error);
        toast({ variant: 'destructive', title: 'Gagal mengubah status.' });
    } finally {
        setItemLoading(item.id, false);
    }
  };
  
  const handleDeleteItem = async (id: string) => {
    setItemLoading(id, true);
    try {
      await deleteDoc(doc(db, 'wishlist_dates', id));
      toast({ title: 'Wishlist telah dihapus.'});
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({ variant: 'destructive', title: 'Gagal menghapus wishlist.' });
    }
  };
  
  const handleSaveEdit = async (id: string, newValues: Omit<WishlistItem, 'id'>) => {
    setItemLoading(id, true);
    const dataToUpdate = {
      title: newValues.title,
      location: newValues.location,
      category: newValues.category,
      description: newValues.description,
      isHighPriority: newValues.isHighPriority,
    };

    try {
      const docRef = doc(db, 'wishlist_dates', id);
      await updateDoc(docRef, dataToUpdate);
      setEditingItemId(null);
      toast({ title: 'Wishlist berhasil diperbarui!' });
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({ variant: 'destructive', title: 'Gagal menyimpan perubahan.' });
    } finally {
      setItemLoading(id, false);
    }
  };

  const handleFileSelectedForUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file || !isAuthenticated) return;
    
    setItemLoading(itemId, true);
    toast({ title: 'Mengupload foto kenangan...' });

    try {
      const storage = getStorage();
      const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const imageRef = storageRef(storage, `wishlist_photos_completed/${itemId}/${uniqueFileName}`);
      
      const uploadResult = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      const docRef = doc(db, 'wishlist_dates', itemId);
      await updateDoc(docRef, { photoUrl: downloadURL });

      toast({ title: 'Foto berhasil disimpan!' });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({ variant: 'destructive', title: 'Gagal Upload Foto', description: (error as Error).message });
    } finally {
      setItemLoading(itemId, false);
    }
  };

  const handleUpdateRating = async (id: string, ratingName: string, newRating: number) => {
    const item = wishlist.find(i => i.id === id);
    if (!item) return;
    
    const currentRatings = item.ratings || [];
    const existingRatingIndex = currentRatings.findIndex(r => r.name === ratingName);

    let newRatings;
    if (existingRatingIndex > -1) {
        newRatings = [...currentRatings];
        newRatings[existingRatingIndex] = { ...newRatings[existingRatingIndex], rating: newRating };
    } else {
        newRatings = [...currentRatings, { name: ratingName, rating: newRating }];
    }

    try {
        await updateDoc(doc(db, 'wishlist_dates', id), { ratings: newRatings });
    } catch (error) {
        console.error("Error updating rating:", error);
        toast({ variant: 'destructive', title: 'Gagal menyimpan rating.' });
    }
  }

  const handleAddRatingItem = async (id: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast({ variant: 'destructive', title: 'Nama rating tidak boleh kosong.' });
      return;
    }

    const item = wishlist.find(i => i.id === id);
    if (!item) return;

    const existingRatings = item.ratings || [];
    if (existingRatings.some(r => r.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast({ variant: 'destructive', title: 'Kategori rating tersebut sudah ada.' });
      return;
    }

    const newRatings = [...existingRatings, { name: trimmedName, rating: 0 }];

    try {
      await updateDoc(doc(db, 'wishlist_dates', id), { ratings: newRatings });
      toast({ title: 'Kategori rating berhasil ditambahkan!' });
    } catch (error) {
      console.error('Error adding rating item:', error);
      toast({ variant: 'destructive', title: 'Gagal menambahkan kategori rating.' });
    }
  };

  const filteredWishlist = wishlist.filter(item => {
    const tabMatch = currentTab === 'impian' ? !item.isCompleted : item.isCompleted;
    const categoryMatch = filterCategory === 'Semua' || item.category === filterCategory;
    return tabMatch && categoryMatch;
  });

  if (!isAuthenticated) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="animate-spin h-10 w-10 text-pink-500 mb-4" />
          <p className="text-gray-500">Menghubungkan ke server...</p>
        </div>
      );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pink-500 font-handwriting">
          Wishlist Nge-date Kita
        </h1>
        <p className="text-gray-500 mt-2">
          Tempat nyimpen semua ide nge-date impian kita ♥
        </p>
      </header>

      <Card className="p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul nge-date..." />
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lokasi/Tempat..." />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kategori..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi nge-date..." rows={3} className="mb-4" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button asChild variant="outline" className="w-full sm:w-auto">
                <label htmlFor="photo-upload-main">
                    <Camera className="mr-2 h-4 w-4" />
                    {photoFile ? `File: ${photoFile.name}` : 'Pilih Foto Utama'}
                    <input id="photo-upload-main" type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)} />
                </label>
            </Button>
            <div className="flex items-center space-x-2">
                <Checkbox id="prioritas" checked={isHighPriority} onCheckedChange={(checked) => setIsHighPriority(Boolean(checked))} />
                <label htmlFor="prioritas" className="text-sm font-medium leading-none">Penting Banget</label>
            </div>
            <Button onClick={handleAddItem} className="bg-pink-500 hover:bg-pink-600 w-full sm:w-auto" disabled={isAdding}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Gas Tambah
            </Button>
        </div>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="impian">Wishlist Nge-date</TabsTrigger>
          <TabsTrigger value="tercapai">Udah Kelakon</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              {currentTab === 'impian' ? (
                <><Heart className="text-pink-500 mr-2" /> List Nge-date Impian</>
              ) : (
                <><CheckCheck className="text-green-500 mr-2" /> List Nge-date Kelakon</>
              )}
            </h2>
             <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Kategori"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua">Semua Kategori</SelectItem>
                  {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
          </div>
          
          <div className="space-y-4">
            {filteredWishlist.length === 0 ? (
                 <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">Kosong nih, belum ada plan.</div>
            ) : (
                filteredWishlist.map(item => (
                    <WishlistItemCard 
                        key={item.id} 
                        item={item}
                        status={itemStatuses[item.id] || {}}
                        isEditing={editingItemId === item.id}
                        onEditStart={() => setEditingItemId(item.id)}
                        onEditSave={handleSaveEdit}
                        onEditCancel={() => setEditingItemId(null)}
                        onToggleComplete={() => handleToggleComplete(item)}
                        onDelete={() => handleDeleteItem(item.id)}
                        onFileSelected={handleFileSelectedForUpload}
                        onUpdateRating={handleUpdateRating}
                        onAddRatingItem={handleAddRatingItem}
                        isAuthenticated={isAuthenticated}
                    />
                ))
            )}
          </div>
        </section>
      </Tabs>
       <footer className="text-center mt-12 border-t pt-4">
         <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
            <Home size={16}/> Kembali ke Menu Utama
        </Link>
      </footer>
    </div>
  );
}

function WishlistItemCard({ item, status, isEditing, onEditStart, onEditSave, onEditCancel, onToggleComplete, onDelete, onFileSelected, onUpdateRating, onAddRatingItem, isAuthenticated }: any) {
    const [editValues, setEditValues] = useState(item);
    const [isAddingRating, setIsAddingRating] = useState(false);
    const [newRatingName, setNewRatingName] = useState('');

    useEffect(() => {
        setEditValues(item);
    }, [item]);
    
    const handleSaveNewRating = () => {
        onAddRatingItem(item.id, newRatingName);
        setIsAddingRating(false);
        setNewRatingName('');
    }

    if (isEditing) {
        return (
            <Card className="p-5 shadow-lg border-pink-500">
                <div className="space-y-3">
                    <Input value={editValues.title} onChange={e => setEditValues({...editValues, title: e.target.value})} className="font-bold text-lg" />
                    <Input value={editValues.location} onChange={e => setEditValues({...editValues, location: e.target.value})} className="text-sm" />
                    <Textarea value={editValues.description} onChange={e => setEditValues({...editValues, description: e.target.value})} rows={4} />
                    <Select value={editValues.category} onValueChange={val => setEditValues({...editValues, category: val})}>
                        <SelectTrigger><SelectValue placeholder="Pilih Kategori..." /></SelectTrigger>
                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                        <Checkbox id={`edit-priority-${item.id}`} checked={editValues.isHighPriority} onCheckedChange={c => setEditValues({...editValues, isHighPriority: Boolean(c)})} />
                        <label htmlFor={`edit-priority-${item.id}`} className="text-gray-600 text-sm">Penting Banget</label>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={onEditCancel} disabled={status.isLoading || !isAuthenticated}>Batal</Button>
                        <Button onClick={() => onEditSave(item.id, editValues)} className="bg-green-500 hover:bg-green-600" disabled={status.isLoading || !isAuthenticated}>
                            {status.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpen
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }
    
    return (
        <Card className={`p-5 shadow-sm transition-opacity ${status.isLoading ? 'opacity-50' : 'opacity-100'} ${item.isHighPriority && !item.isCompleted ? 'border-pink-300' : ''}`}>
            <div className="flex flex-col sm:flex-row gap-4">
                {item.photoUrl && (
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.photoUrl} alt={`Foto ${item.title}`} layout="fill" objectFit="cover" />
                    </div>
                )}
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            {item.location ? (
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-600 hover:underline flex items-center gap-1 mb-2">
                                    <MapPin size={14}/> {item.location}
                                </a>
                            ) : (
                                <p className="text-sm text-gray-500 mb-2 flex items-center gap-1"><MapPin size={14}/> Lokasi belum ditentuin</p>
                            )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500" onClick={onEditStart} disabled={status.isLoading || !isAuthenticated}><FilePenLine size={18}/></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-500" onClick={onToggleComplete} disabled={status.isLoading || !isAuthenticated}>
                                {status.isLoading ? <Loader2 size={18} className="animate-spin" /> : item.isCompleted ? <Undo2 size={18}/> : <CheckCircle2 size={18} />}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" disabled={status.isLoading || !isAuthenticated}><Trash2 size={18}/></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Yakin mau hapus wishlist ini?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Aksi ini tidak bisa dibatalkan. Wishlist "{item.title}" akan dihapus permanen.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Ya, Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    <p className="text-gray-600 my-3 whitespace-pre-wrap">{item.description}</p>
                    <div className="flex justify-between items-center text-sm">
                        <div className="bg-pink-100 text-pink-700 font-semibold px-3 py-1 rounded-full">{item.category || 'Lainnya'}</div>
                        {item.isHighPriority && !item.isCompleted && (
                            <span className="text-red-500 font-bold flex items-center gap-1"><Star size={14}/>Penting</span>
                        )}
                    </div>
                </div>
            </div>

            {item.isCompleted && (
                 <div className="mt-4 pt-4 border-t">
                    {!item.photoUrl && (
                        <>
                         <Button variant="outline" className="w-full border-dashed mb-4" onClick={() => document.getElementById(`photo-upload-input-${item.id}`)?.click()} disabled={status.isLoading || !isAuthenticated}>
                            {status.isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Camera className="mr-2"/>}
                            Upload Foto Kenangan
                         </Button>
                         <input
                            type="file"
                            id={`photo-upload-input-${item.id}`}
                            className="hidden"
                            accept="image/png, image/jpeg"
                            onChange={(e) => onFileSelected(e, item.id)}
                         />
                        </>
                    )}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-600">Rating Pengalaman:</p>
                        {(item.ratings || []).length > 0 ? (
                            (item.ratings || []).map((r: {name: string, rating: number}) => (
                                <div key={r.name} className="flex justify-between items-center">
                                    <p className="text-sm">{r.name}</p>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star 
                                                key={star}
                                                size={18}
                                                className={`cursor-pointer ${r.rating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                                onClick={() => onUpdateRating(item.id, r.name, star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isAddingRating && <p className="text-xs text-gray-400 italic">Belum ada rating. Tambahkan satu!</p>
                        )}
                        
                        {isAddingRating ? (
                            <div className="flex items-center gap-2 pt-2">
                                <Input 
                                    value={newRatingName}
                                    onChange={e => setNewRatingName(e.target.value)}
                                    placeholder="e.g. Suasana, Makanan"
                                    className="h-9"
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNewRating() }}
                                />
                                <Button size="sm" onClick={handleSaveNewRating} className="bg-green-500 hover:bg-green-600">Simpan</Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsAddingRating(false)}>Batal</Button>
                            </div>
                        ) : (
                            <div className="pt-1">
                                 <Button variant="link" size="sm" className="p-0 h-auto text-pink-600 font-semibold" onClick={() => setIsAddingRating(true)}>
                                    + Tambah Kategori Rating
                                 </Button>
                            </div>
                        )}
                    </div>
                 </div>
            )}
        </Card>
    )
}
