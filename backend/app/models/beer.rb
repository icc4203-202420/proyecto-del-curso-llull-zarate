class Beer < ApplicationRecord
  belongs_to :brand
  has_many :countries, through: :brand
  has_many :breweries, through: :brand
  has_many :reviews, dependent: :destroy
  has_many :users, through: :reviews
  has_one_attached :image

  has_many :bars_beers
  has_many :bars, through: :bars_beers  
  
  validates :name, presence: true
  validates :image, content_type: { in: ['image/png', 'image/jpg', 'image/jpeg'],
                                    message: 'must be a valid image format' },
                    size: { less_than: 5.megabytes }       

  def thumbnail
    image.variant(resize_to_limit: [200, 200]).processed
  end

  # Método para actualizar el rating promedio de la cerveza
  def update_avg_rating
    if reviews.any?
      avg = reviews.average(:rating).to_f
      update_column(:avg_rating, avg.round(2)) # Redondear el promedio a dos decimales
    else
      update_column(:avg_rating, 0.0) # Si no hay reseñas, poner el rating en 0.0
    end
  end  
end
