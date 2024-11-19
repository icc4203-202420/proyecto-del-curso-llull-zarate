class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  after_save :update_beer_rating
  after_destroy :update_beer_rating
  #afeter_create_commit : broadcast_to_firends

  private

  def update_beer_rating
    beer.update_avg_rating
  end

end

##data.user--> frontend