const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: [1, 'Value must be between 1.0 and 5.0'],
      max: [5, 'Value must be between 1.0 and 5.0'],
      required: [true, 'Rating is required!']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!']
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // });
  // this.populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  next();
});

// STATIC METHOD
reviewSchema.statics.calcAverageRating = async function(tourId) {
  // This points to model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(
      { _id: tourId },
      {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
      }
    );
  } else {
    await Tour.findByIdAndUpdate(
      { _id: tourId },
      {
        ratingsQuantity: 0,
        ratingsAverage: 4.5
      }
    );
  }
};

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  // save on this to past from pre to post middleware
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRating(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
