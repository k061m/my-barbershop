import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface GalleryImage {
  id?: string;
  url: string;
  title: string;
  category: string;
  createdAt?: Date;
}

export const galleryService = {
  async getImages() {
    try {
      const imagesRef = collection(db, 'gallery');
      const q = query(imagesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
    } catch (error) {
      console.error('Error getting gallery images:', error);
      throw error;
    }
  },

  async addImage(image: Omit<GalleryImage, 'id' | 'createdAt'>) {
    try {
      const imagesRef = collection(db, 'gallery');
      const docRef = await addDoc(imagesRef, {
        ...image,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding gallery image:', error);
      throw error;
    }
  },

  async deleteImage(imageId: string) {
    try {
      const imageRef = doc(db, 'gallery', imageId);
      await deleteDoc(imageRef);
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      throw error;
    }
  },

  async initializeGallery() {
    const initialImages = [
      {
        url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=2074&auto=format&fit=crop',
        title: 'Classic Fade',
        category: 'Haircut'
      },
      {
        url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2088&auto=format&fit=crop',
        title: 'Modern Pompadour',
        category: 'Styling'
      },
      {
        url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop',
        title: 'Beard Trim',
        category: 'Grooming'
      },
      {
        url: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?q=80&w=2070&auto=format&fit=crop',
        title: 'Textured Crop',
        category: 'Haircut'
      },
      {
        url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop',
        title: 'Skin Fade',
        category: 'Haircut'
      },
      {
        url: 'https://www.shutterstock.com/image-photo/young-male-barber-adjusts-hair-600nw-2179029579.jpg',
        title: 'Beard Grooming',
        category: 'Grooming'
      },
      {
        url: 'https://media.istockphoto.com/id/1308316066/de/foto/friseur-gibt-eine-rasur-in-seinem-gesch%C3%A4ft.jpg?s=2048x2048&w=is&k=20&c=73OiL7QtdewDrXXOA0kqt1bOehcf54i3j65NI0eGWjI=',
        title: 'Classic Scissor Cut',
        category: 'Haircut'
      },
      {
        url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2069&auto=format&fit=crop',
        title: 'Modern Styling',
        category: 'Styling'
      }
    ];

    try {
      const imagesRef = collection(db, 'gallery');
      const existingImages = await getDocs(imagesRef);
      
      if (existingImages.empty) {
        console.log('Initializing gallery with sample images...');
        const addPromises = initialImages.map(image => this.addImage(image));
        await Promise.all(addPromises);
        console.log('Gallery initialized successfully');
      } else {
        console.log('Gallery already contains images, skipping initialization');
      }
    } catch (error) {
      console.error('Error initializing gallery:', error);
      throw error;
    }
  }
}; 