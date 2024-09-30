class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances

  has_one_attached :flyer
  has_one_attached :image

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end  
end
