class MatsController < ApplicationController
  def create
    new_mat = BattleMats.new(params[:mat])
    new_mat.x_dimension = 10
    new_mat.y_dimension = 16
    new_mat.save
    redirect_to :action => 'index'
  end

  def destroy
    BattleMats.find_by_id(params[:id]).destroy()
    redirect_to :action => 'index'
  end
  
  def index
    @mats = BattleMats.find :all
  end
  
  def new
    redirect_to :action => 'index'
  end
  
  def edit
    @mat = BattleMats.find_by_id(params[:id])
    if not @mat
      redirect_to :action => "index"
    end

    @backgrounds = []
    Dir.foreach('public/images/textures/backgrounds') do |entry|
      if entry =~ /\.(png|jp.?g)$/i then
        @backgrounds << entry
      end
    end
    
    @tiles = []
    Dir.foreach('public/images/textures/tiles') do |entry|
      if entry =~ /\.(png|jp.?g)$/i then
        @tiles << entry
      end
    end
  end
  
  def update
    mat = BattleMats.find_by_id(params[:id])
    mat.description = params[:mat][:description]
    mat.x_dimension = params[:mat][:x_dimension]
    mat.y_dimension = params[:mat][:y_dimension]
    
    # Remove "url(...)" from background argument
    if params[:mat][:background] and 
        params[:mat][:background] =~ /url\(([^)]*)\)/ then
      mat.background = $1
    end
    mat.save
    
    # Save tiles of this mat
    puts "---"
    puts params[:mat][:tiles]["1"]["1"]
    puts "---"
  end

  def show
    @mat = BattleMats.find_by_id(params[:id])
    render :layout => "plain"
  end
end
