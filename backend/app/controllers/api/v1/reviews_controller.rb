class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:create, :index], if: -> { params[:user_id].present? }
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :set_beer, only: [:index, :create], if: -> { params[:beer_id].present? }

  def index
    if @user
      @reviews = Review.where(user: @user)
    elsif @beer
      @reviews = Review.where(beer: @beer)
    else
      @reviews = Review.all
    end

    render json: {
      reviews: @reviews.as_json(include: {
        user: { only: [:handle, :email] }
      })
    }, status: :ok
  end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    if @user && @beer
      @review = @beer.reviews.build(review_params.merge(user: @user))
      if @review.save
        render json: @review.as_json(include: { user: { only: [:handle, :email] } }), status: :created
      else
        render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: "User or Beer not found" }, status: :not_found
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_user
    @user = User.find_by(id: params[:user_id])
    render json: { error: "User not found" }, status: :not_found unless @user
  end

  def set_beer
    @beer = Beer.find_by(id: params[:beer_id])
    render json: { error: "Beer not found" }, status: :not_found unless @beer
  end

  def review_params
    params.require(:review).permit(:id, :text, :rating, :beer_id)
  end
end
