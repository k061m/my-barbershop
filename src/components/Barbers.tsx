import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTranslation } from 'react-i18next';

interface BarberTranslation {
  name: string;
  description: string;
  specialties: string;
}

interface Barber {
  id: string;
  image: string;
  translations: {
    [key: string]: BarberTranslation;
  };
}

export default function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const barbersRef = collection(db, 'barbers');
        const snapshot = await getDocs(barbersRef);
        const barbersData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Barber[];
        setBarbers(barbersData);
      } catch (error) {
        console.error('Error fetching barbers:', error);
      }
    };

    fetchBarbers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <div key={barber.id} className="card bg-base-100 shadow-xl">
            <figure>
              <img src={barber.image} alt={barber.translations[currentLang].name} className="w-full h-64 object-cover" />
            </figure>
            <div className="card-body">
              <h3 className="card-title">{barber.translations[currentLang].name}</h3>
              <p className="text-lg font-semibold">{barber.translations[currentLang].description}</p>
              <p className="text-sm">{barber.translations[currentLang].specialties}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 