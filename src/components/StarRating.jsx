import React from 'react';
import { StarIcon } from './icons';

const StarRating = ({ rating, setRating }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="p-1">
                <StarIcon filled={star <= rating} color="#ffc107" />
            </button>
        ))}
    </div>
);

export default StarRating; 