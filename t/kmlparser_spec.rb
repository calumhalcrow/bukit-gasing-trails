require 'kmlparser'

describe KMLParser, '#new' do
  it "has some object attrs after construction" do
    parser = KMLParser.new(1234)
    parser.map_ids.should eq([1234])
  end
end

describe KMLParser, '#parse' do
  it "can have some map data set to the data attr." do
    parser = KMLParser.new(1234)
    parser.gm_data = _sample_data
    expect(parser.gm_data).not_to be_empty

    parser.parse

    expect(parser.ways).not_to be_empty
    expect(parser.ways.length).to eq(7)
    expect(parser.ways[0]["name"]).to eq("Pantai Hillpark Link")

    expect(parser.points.length).to eq(1)
    expect(parser.points[0]["name"]).to eq("Old House")
    expect(parser.points[0]["category"]).to eq("lookouttower")
    expect(parser.points[0]["desc"]).to eq("This is where the old house is.")
    expect(parser.points[0]["thumb"]).to eq("http://example.com/thumb.jpg")

    rimba = parser.ways.select{|w| w["name"] == "Rimba Tower"}[0]
    expect(rimba["desc"]).to eq("Nice little park.");
    expect(rimba["category"]).to eq("park");
  end
end

def _sample_data
  return [{"xmlns"=>"http://earth.google.com/kml/2.2",
 "Document"=>
  [{"name"=>["Bukit Gasing Uncharted"],
    "description"=>[{}],
    "Style"=>
     [{"id"=>"style7", "LineStyle"=>[{"color"=>["80009900"], "width"=>["5"]}]},
      {"id"=>"style6", "LineStyle"=>[{"color"=>["80009900"], "width"=>["5"]}]},
      {"id"=>"style4", "LineStyle"=>[{"color"=>["80009900"], "width"=>["5"]}]},
      {"id"=>"style3",
       "LineStyle"=>[{"color"=>["40000000"], "width"=>["3"]}],
       "PolyStyle"=>
        [{"color"=>["73009900"], "fill"=>["1"], "outline"=>["1"]}]},
      {"id"=>"style5", "LineStyle"=>[{"color"=>["80009900"], "width"=>["5"]}]},
      {"id"=>"style1", "LineStyle"=>[{"color"=>["80009900"], "width"=>["5"]}]},
      {"id"=>"style2", "LineStyle"=>[{"color"=>["80009900"], "width"=>["5"]}]},
      {"id"=>"style8",
       "IconStyle"=>
        [{"Icon"=>
           [{"href"=>
              ["http://maps.gstatic.com/mapfiles/ms2/micons/homegardenbusiness.png"]}]}]}],
    "Placemark"=>
     [{"name"=>["Pantai Hillpark Link"],
       "description"=>[{}],
       "styleUrl"=>["#style7"],
       "LineString"=>
        [{"tessellate"=>["1"],
          "coordinates"=>
           ["\n        101.661217,3.103929,0.000000\n        101.661110,3.103688,0.000000\n        101.660912,3.103393,0.000000\n        101.660828,3.103289,0.000000\n        101.660568,3.103270,0.000000\n        101.660080,3.102750,0.000000\n        101.660034,3.102590,0.000000\n        101.659943,3.102531,0.000000\n        101.659904,3.102477,0.000000\n        101.659813,3.102477,0.000000\n        101.659714,3.102416,0.000000\n      "]}]},
      {"name"=>["Valley West"],
       "description"=>[{}],
       "styleUrl"=>["#style6"],
       "LineString"=>
        [{"tessellate"=>["1"],
          "coordinates"=>
           ["\n        101.658546,3.100222,0.000000\n        101.658684,3.100094,0.000000\n        101.658752,3.099917,0.000000\n        101.658844,3.099727,0.000000\n        101.658890,3.099561,0.000000\n        101.658958,3.099346,0.000000\n        101.659096,3.099218,0.000000\n        101.659248,3.099220,0.000000\n        101.659401,3.099178,0.000000\n        101.659576,3.099022,0.000000\n        101.659760,3.098915,0.000000\n        101.659851,3.098795,0.000000\n        101.659882,3.098647,0.000000\n        101.659882,3.098524,0.000000\n        101.659958,3.098436,0.000000\n        101.660042,3.098248,0.000000\n        101.660179,3.098045,0.000000\n        101.660324,3.097938,0.000000\n        101.660385,3.097761,0.000000\n        101.660370,3.097576,0.000000\n      "]}]},
      {"name"=>["Bamboo Grove Link"],
       "description"=>[{}],
       "styleUrl"=>["#style4"],
       "LineString"=>
        [{"tessellate"=>["1"],
          "coordinates"=>
           ["\n        101.660393,3.097710,0.000000\n        101.660515,3.097688,0.000000\n        101.660896,3.097715,0.000000\n      "]}]},
      {"name"=>["Taman Rimba"],
       "description"=>[{}],
       "styleUrl"=>["#style3"],
       "Polygon"=>
        [{"outerBoundaryIs"=>
           [{"LinearRing"=>
              [{"tessellate"=>["1"],
                "coordinates"=>
                 ["\n            101.661423,3.097075,0.000000\n            101.661705,3.097244,0.000000\n            101.661926,3.097196,0.000000\n            101.662010,3.097089,0.000000\n            101.661903,3.096810,0.000000\n            101.661652,3.096748,0.000000\n            101.661400,3.096872,0.000000\n            101.661324,3.096989,0.000000\n            101.661423,3.097075,0.000000\n          "]}]}]}]},
      {"name"=>["Valley East"],
       "description"=>[{}],
       "styleUrl"=>["#style5"],
       "LineString"=>
        [{"tessellate"=>["1"],
          "coordinates"=>
           ["\n        101.661438,3.097097,0.000000\n        101.661186,3.097289,0.000000\n        101.660896,3.097696,0.000000\n        101.660759,3.097884,0.000000\n      "]}]},
      {"name"=>["Bukit Kerinchi Trail"],
       "description"=>[{}],
       "styleUrl"=>["#style1"],
       "LineString"=>
        [{"tessellate"=>["1"],
          "coordinates"=>
           ["\n        101.659737,3.098931,0.000000\n        101.659798,3.099012,0.000000\n        101.659782,3.099078,0.000000\n        101.660027,3.099274,0.000000\n      "]}]},
      {"name"=>["Rimba Tower"],
       "description"=>['{"category":"park","desc":"Nice little park."}'],
       "styleUrl"=>["#style2"],
       "LineString"=>
        [{"tessellate"=>["1"],
          "coordinates"=>
           ["\n        101.661522,3.096810,0.000000\n        101.661583,3.096750,0.000000\n        101.661423,3.096560,0.000000\n        101.660912,3.096200,0.000000\n        101.660881,3.096050,0.000000\n        101.660973,3.095602,0.000000\n      "]}]},
      {"name"=>["Old House"],
       "description"=>
        ['{"category":"lookouttower","desc":"This is where the old house is.","thumb":"http://example.com/thumb.jpg"}'],
       "styleUrl"=>["#style8"],
       "Point"=>[{"coordinates"=>["101.659851,3.099116,0.000000"]}]}]}]}]
end
