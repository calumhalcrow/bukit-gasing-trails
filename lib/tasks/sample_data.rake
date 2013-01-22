namespace :sample_data do
  desc "Adds two Ways to DB, which cross in the middle."
  task :cross => :environment do

    Node.new(:lat => 3.097193, :lon => 101.657349).save
    Node.new(:lat => 3.097836, :lon => 101.659774).save
    Node.new(:lat => 3.098307, :lon => 101.662692).save
    Node.new(:lat => 3.101328, :lon => 101.659817).save
    Node.new(:lat => 3.094150, :lon => 101.660246).save
    Way.new(:name => 'Test Way 1', :category => 'trail').save
    Way.new(:name => 'Test Way 2', :category => 'trail').save
    Position.new(:way_id => 1, :node_id => 1, :order => 1).save
    Position.new(:way_id => 1, :node_id => 2, :order => 2).save
    Position.new(:way_id => 1, :node_id => 3, :order => 3).save
    Position.new(:way_id => 2, :node_id => 4, :order => 1).save
    Position.new(:way_id => 2, :node_id => 2, :order => 2).save
    Position.new(:way_id => 2, :node_id => 5, :order => 3).save

  end
end
