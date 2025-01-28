const reviews = [
  {
    id: 1,
    name: "Michael Brown",
    rating: 5,
    comment: "Best haircut I've ever had! The attention to detail was amazing.",
    date: "2024-01-15",
    barber: "John Doe"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    rating: 5,
    comment: "Great atmosphere and professional service. Will definitely come back!",
    date: "2024-01-10",
    barber: "Jane Smith"
  },
  {
    id: 3,
    name: "David Clark",
    rating: 4,
    comment: "Very satisfied with my beard trim. The barber was very skilled.",
    date: "2024-01-05",
    barber: "John Doe"
  },
  // Add more reviews as needed
];

export default function ReviewsPage() {
  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Customer Reviews</h1>
        
        <div className="stats shadow w-full mb-8">
          <div className="stat place-items-center">
            <div className="stat-title">Total Reviews</div>
            <div className="stat-value">{reviews.length}</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Average Rating</div>
            <div className="stat-value text-primary">
              {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {reviews.map(review => (
            <div key={review.id} className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title">{review.name}</h2>
                    <p className="text-sm text-base-content/70">Barber: {review.barber}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 text-xl">{renderStars(review.rating)}</div>
                    <p className="text-sm text-base-content/70">{review.date}</p>
                  </div>
                </div>
                <p className="mt-4">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="btn btn-primary">Write a Review</button>
        </div>
      </div>
    </div>
  );
} 