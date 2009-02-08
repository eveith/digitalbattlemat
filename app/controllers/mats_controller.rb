class MatsController < ApplicationController
  def create
    new_mat = BattleMats.new(params[:mat])
    new_mat.save
  end

  def destroy
    BattleMats.find_by_id(params[:id]).destroy()
    redirect_to :action => 'index'
  end
  
  def index
    @mats = BattleMats.find :all
  end
  
  def new
    render :template => 'mats/new_and_edit'    
  end
  
  def edit
    render :template => 'mats/new_and_edit'
  end

end
