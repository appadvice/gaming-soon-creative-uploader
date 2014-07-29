class GameTrailersController < ApplicationController
  
  def index
    @game = JSON.parse(open('http://couchview.wp.appadvice.com/?gametrailer=back-to-bed').read)
  end
end
