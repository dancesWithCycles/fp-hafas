var extend =		require('extend');





var l = module.exports = {
	types:		{},
	properties:	{}
};



l.types.station = l.types.S = l.types.ST = {
	id:			'ST',
	bitmask:	1,
	alt:		'S',
	type:		'station'
};

l.types.address = l.types.A = l.types.ADR = {
	id:			'ADR',
	bitmask:	2,
	alt:		'A',
	type:		'address'
};

l.types.poi = l.types.P = l.types.POI = {
	id:			'POI',
	bitmask:	4,
	alt:		'P',
	type:		'poi'
};

l.types.unknown = {
	id:			null,
	bitmask:	null,
	alt:		null,
	type:		'unknown'
};

l.bitmasks = [];
l.bitmasks[1] = l.types.station;
l.bitmasks[2] = l.types.address;
l.bitmasks[4] = l.types.poi;



l.properties.lift = l.properties.AT = {
	id:		'AT',
	type:	'lift'
};

l.properties.groundLevel = l.properties.E5 = {
	id:		'E5',
	type:	'groundLevel'
};

l.properties.handicapAccessible = l.properties.BF = {
	id:		'BF',
	type:	'handicapAccessible'
};

l.properties.tactilePaving = l.properties.BL = {
	id:		'BL',
	type:	'tactilePaving'
};

l.properties.escalator = l.properties.FT = {
	id:		'FT',
	type:	'escalator'
};

l.properties.touchAndTravel = l.properties.TT = {
	id:		'tt',
	type:	'touchAndTravel'
};





l.createApiString = function (types) {
	var result = '';
	for (var type in types) {
		if (types[type] && l.types[type])
			result += l.types[type].alt;
	}
	return result;
};

l.parseApiString = function (string) {
	var result = {};
	for (var alt of string) {
		if (l.types[alt])
			result[l.types[alt].type] = true;
	}
	return result;
};



l.createApiId = function (id) {
	return id + '';
};

l.parseApiId = function (id) {
	return parseFloat(id);
};



l.createApiBitmask = function (types) {
	var result = 0;
	for (var type in types) {
		if (types[type] != true) continue;
		result += l.types[type].bitmask;
	}
	return result;
};
l.parseApiBitmask = function (number) {
	var result = {}, i = 1;
	do {
		result[l.bitmasks[i].type] = !!(number & i);
		i *= 2;
	} while (l.bitmasks[i] && l.bitmasks[i].type)
	return result;
};



l.parseApiLocation = function (location) {
	var result = {
		title:		location.name,
		latitude:	location.lat,
		longitude:	location.lon
	};
	if (location.extId) result.id = l.parseApiId(location.extId);
	if (l.types[location.type]) result.type = l.types[location.type].type;
	else if (result.id) result.type = l.types.station.type;
	else result.type = l.types.unknown.type;
	if (location.Notes) result.notes = l.parseApiNotes(location.Notes);
	return result;
};



l.parseApiNotes = function (notes) {
	var result = {};
	var i, property;
	for (i in notes.Note) {
		property = l.properties[notes.Note[i].key];
		if (property) result[property.type] = true;
	}
	return result;
};
