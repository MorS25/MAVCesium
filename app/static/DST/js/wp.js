var alt_lines = scene.primitives.add(new Cesium.PolylineCollection)
var markers = scene.primitives.add(new Cesium.BillboardCollection)
var paths = scene.primitives.add(new Cesium.PolylineCollection)

function create_wp(id, wp_data){
	destroy_wp(id)
	if (wp_data.frame == 0) {
		height_offset = 0
		add_visuals()
		
	} else if (wp_data.frame == 3){
		height_offset = home_alt_wgs84
		add_visuals()
		
	} else if (wp_data.frame == 10){
		var pointOfInterest = Cesium.Cartographic.fromDegrees(
			wp_data.y, wp_data.x, 5000, new Cesium.Cartographic()
		);
	  	// Sample the terrain (async)
	  	Cesium.sampleTerrain(viewer.terrainProvider, 11, [ pointOfInterest ]).then(function(samples) {
	  		height_offset = samples[0].height
	  		add_visuals()
		});
	} else{
		console.log('wp create unhandled')
	}
	
	function add_visuals() {
    	if (defines){
    		console.log(id, defines.mission_commands[wp_data.command])
    	}
        alt_lines.add({
            id : id,
            positions : Cesium.Cartesian3.fromDegreesArrayHeights( [wp_data.y, wp_data.x, wp_data.z+height_offset,   wp_data.y, wp_data.x, 0]  ),
            width : 1,
            material : Cesium.Material.fromType('Color', {
                color : Cesium.Color.BLACK
                }) //DODGERBLUE
        });
        
        markers.add({
            id : id,
            position : Cesium.Cartesian3.fromDegrees(wp_data.y, wp_data.x, wp_data.z+height_offset),
            image : '/static/DST/wp_icons/blu-blank.png',
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM
        
        });
	}
	
}

function destroy_wp(id){
	var wp_alt_line = get_by_id(alt_lines, id)
	alt_lines.remove(wp_alt_line)
    var wp_marker = get_by_id(markers, id)
	markers.remove(wp_marker)
}

function clear_mission(){
	for (wp in wp_alt_line) {
		console.log('destroy', wp)
		destroy_wp(wp.id)
	}
}
    
    