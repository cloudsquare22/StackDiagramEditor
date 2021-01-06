function drawJSON(canvasID, jsonString) {
    var jsonObject = JSON.parse(jsonString);
    console.log(jsonObject);
    jsonObject.forEach(function(value, index, ar) {
        switch(value.type) {
            case  1: // Arcs
                $('#' + canvasID).drawArc(value.data);
                break;
            case  2: // Quadratic Curves
                $('#' + canvasID).drawQuadratic(value.data);
                break;
            case  3: // Bezier Curves
                $('#' + canvasID).drawBezier(value.data);
                break;
            case  4: // Ellipses
                $('#' + canvasID).drawEllipse(value.data);
                break;
            case  5: // Images
                $('#' + canvasID).drawImage(value.data);
                break;
            case  6: // Lines
                $('#' + canvasID).drawLine(value.data);
                break;
            case  8: // Paths
                $('#' + canvasID).drawPath(value.data);
                break;
            case  9: // Polygons
                $('#' + canvasID).drawPolygon(value.data);
                break;
            case 10: // Rectangles
                $('#' + canvasID).drawRect(value.data);
                break;
            case 11: // Slices
                $('#' + canvasID).drawSlice(value.data);
                break;
            case 12: // Text
                $('#' + canvasID).drawText(value.data);
                break;
            case 13: // Vectors
                $('#' + canvasID).drawVector(value.data);
                break;
        }
    });
}