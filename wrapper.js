$("#bpm").slider({
	range: "min",
	min: 20,
	max: 800,
	value: 120,
	slide: function(event, ui){
		$("#bpmValue").val(ui.value);
		bpm = ui.value;
	}
});
$("#bpmValue").val($("#bpm").slider("value"));
bpm = $("#bpm").slider("value");


$("#noteLength").slider({
	range: "min",
	min: 0,
	max: .5,
	value: .1,
	step: .01,
	slide: function(event, ui){
		$("#noteLengthValue").val(ui.value + " ms");
		noteLength = ui.value;
	}
});
$("#noteLengthValue").val($("#noteLength").slider("value") + " ms");
noteLength = $("#noteLength").slider("value");

$("#pitch").slider({
	range: "min",
	min: 0,
	max: 1000,
	value: 100,
	step: .01,
	slide: function(event, ui){
		$("#pitchValue").val(ui.value);
		pitch = ui.value;
	}
});
$("#pitchValue").val($("#pitch").slider("value"));
pitch = $("#pitch").slider("value");

$("#scales").buttonset();
$("#scales").click(function(){
	updateScale($("#scales :radio:checked + label").text());
});

$("#waveform").buttonset();
$("#waveform").click(function(){
	var wf = {Sine: 0, Square: 1, Saw: 2, Triangle: 3};
	waveform = wf[$("#waveform :radio:checked + label").text()];
});