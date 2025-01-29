export const barbers = {
  johnSmith: {
    id: 'johnSmith',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
    available: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    translations: {
      en: {
        name: 'John Smith',
        description: 'Master Barber',
        specialties: 'Classic cuts, Beard styling'
      },
      de: {
        name: 'John Smith',
        description: 'Meister-Barbier',
        specialties: 'Klassische Schnitte, Bart-Styling'
      },
      ar: {
        name: 'جون سميث',
        description: 'حلاق محترف',
        specialties: 'قصات كلاسيكية، تصفيف اللحية'
      }
    }
  },
  // Add more barbers as needed
}; 