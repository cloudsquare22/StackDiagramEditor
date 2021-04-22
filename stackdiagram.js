var targetElement; // 現作業オブジェクト
var stackElements = {}; // データ
// var itemid = 0; // ID払出用
var defaultHeight = 50;
var defaultWidth = 200;
var defaultX = 150;
var defaultY = 750;
var Direction = {
    none: 0,
    north : 1,
    east: 2,
    south: 3,
    west: 4
};


function createElementID(x, y) {
    return x.toString(10) + '-' + y.toString(10);
}

function stackDiagramInit() {
    addElement(Direction.none);

    contextMenuInit();
}

function clearCanvas() {
    var layers = $('#canvas').getLayers();    
    console.log(layers)
    $('#canvas').removeLayers();
    console.log(layers)
    stackElements = {};
    stackDiagramInit();
}

function contextMenuInit() {
    // $('#menuitemAddNorth').on('click', function() {
    //     console.log('追加－上');
    //     $('#menu01').css('visibility', 'hidden');

    //     addElement(Direction.north);
    // });

    // $('#menuitemAddEast').on('click', function() {
    //     console.log('追加－右');
    //     $('#menu01').css('visibility', 'hidden');

    //     addElement(Direction.east);
    // });

    // $('#menuitemAddSouth').on('click', function() {
    //     console.log('追加ー下');
    //     $('#menu01').css('visibility', 'hidden');

    //     addElement(Direction.south);
    // });

    // $('#menuitemAddWest').on('click', function() {
    //     console.log('追加－左');
    //     $('#menu01').css('visibility', 'hidden');

    //     addElement(Direction.west);
    // });

    $('#menuitemJoinNorth').on('click', function() {
        console.log('結合－上');
        $('#menu01').css('visibility', 'hidden');

        joinUnJoin(Direction.north, true);
    });

    $('#menuitemJoinEast').on('click', function() {
        console.log('結合－右');
        $('#menu01').css('visibility', 'hidden');

        joinUnJoin(Direction.east, true);
    });

    $('#menuitemJoinSouth').on('click', function() {
        console.log('結合－下');
        $('#menu01').css('visibility', 'hidden');

        joinUnJoin(Direction.south, true);
    });

    $('#menuitemJoinWest').on('click', function() {
        console.log('結合－左');
        $('#menu01').css('visibility', 'hidden');

        joinUnJoin(Direction.west, true);
    });

    $('#menuitemUnJoinNorth').on('click', function() {
        console.log('結合解除－上');
        $('#menu01').css('visibility', 'hidden');

        joinUnJoin(Direction.north, false);
    });

    $('#menuitemUnJoinEast').on('click', function() {
        console.log('結合解除－右');
        $('#menu01').css('visibility', 'hidden');

        joinUnJoin(Direction.east, false);
    });

    $('#menuitemUnJoinSouth').on('click', function() {
        console.log('結合解除－下');
        $('#menu01').css('visibility', 'hidden');

        joinUnJoin(Direction.south, false);
    });

    $('#menuitemUnJoinWest').on('click', function() {
        console.log('結合解除－左');
        $('#menu01').css('visibility', 'hidden');

        joinUnJoin(Direction.west, false);
    });

    $('#menuitemDel').on('click', function() {
        console.log('削除')
        console.log(targetElement)
        $('#menu01').css('visibility', 'hidden');
        if(targetElement.name != createElementID(0, 0)) { // 開始マスは削除させない。
            $('#canvas').removeLayerGroup(targetElement.groups[0])
            $('#canvas').drawLayers();
            removeElement()
            delete stackElements[targetElement.name];
            console.log(stackElements);
        }
    });

    $('#menuitemEditText').on('click', function() {
        console.log('テキスト編集')
        $('#menu01').css('visibility', 'hidden');

        var textElement = $('#canvas').getLayer(targetElement.name + '-text');
        result = prompt("テキスト", textElement.text);
        if(result != null) {
            textElement.text = result;
            $('#canvas').drawLayers();
        }
        console.log(textElement);
    });

    $('#canvas').on('click', function() {
        $('#menu01').css('visibility', 'hidden');
    });

    $('#download').on('click', function() {
        console.log('Download');
        var base64 = $('canvas').getCanvasImage('jpg');
        document.getElementById("download").href = base64;
    });
}

function joinUnJoin(direction, join) {
    var joinX;
    var joinY;
    switch(direction) {
        case Direction.north:
            joinX = targetElement.data.x;
            joinY = targetElement.data.y + 1;
            break;
        case Direction.east:
            joinX = targetElement.data.x + 1;
            joinY = targetElement.data.y;
            break;
        case Direction.south:
            joinX = targetElement.data.x;
            joinY = targetElement.data.y - 1;
            break;
        case Direction.west:
            joinX = targetElement.data.x - 1;
            joinY = targetElement.data.y;
            break;
    }
    var joinElement = $('#canvas').getLayer(createElementID(joinX, joinY));
    if(joinElement != undefined) {
        switch(direction) {
            case Direction.north:
                targetElement.data.join.north = join;
                joinElement.data.join.south = join;
                break;
            case Direction.east:
                targetElement.data.join.east = join;
                joinElement.data.join.west = join;
                break;
            case Direction.south:
                targetElement.data.join.south = join;
                joinElement.data.join.north = join;
                break;
            case Direction.west:
                targetElement.data.join.west = join;
                joinElement.data.join.east = join;
                break;
        }
        drawStroke(targetElement);
        drawStroke(joinElement);
        console.log(stackElements);
    }
}

function addElement(direction) {
    var positionX = 0;
    var positionY = 0;
    var x = defaultX;
    var y = defaultY;
    switch(direction) {
        case Direction.none:
            break;
        case Direction.north:
            positionX = targetElement.data.x;
            positionY = targetElement.data.y + 1;
            x = targetElement.x;
            y = targetElement.y - targetElement.height;
            break;
        case Direction.east:
            positionX = targetElement.data.x + 1;
            positionY = targetElement.data.y;
            x = targetElement.x + targetElement.width;
            y = targetElement.y;
            break;
        case Direction.south:
            positionX = targetElement.data.x;
            positionY = targetElement.data.y - 1;
            x = targetElement.x;
            y = targetElement.y + targetElement.height;
            break;
        case Direction.west:
            positionX = targetElement.data.x - 1;
            positionY = targetElement.data.y;
            x = targetElement.x - targetElement.width;
            y = targetElement.y;
            break;
    }

    if((positionX >= 0) && (positionY >=0)) {
        var id = createElementID(positionX, positionY);
        var data = {
            x: positionX,
            y: positionY,
            join : {
                north: false,
                east: false,
                south: false,
                west: false
            }
        };

        // 追加Element周辺Element「＋」制御
        var idNorth = createElementID(positionX, positionY + 1);
        if($('#canvas').getLayer(idNorth) != undefined) {
            $('#canvas').removeLayer(idNorth + '-plus-south');
            $('#canvas').drawLayers();
        }
        var idEast = createElementID(positionX + 1, positionY);
        if($('#canvas').getLayer(idEast) != undefined) {
            $('#canvas').removeLayer(idEast + '-plus-west');
            $('#canvas').drawLayers();
        }
        var idSouth = createElementID(positionX, positionY - 1);
        if($('#canvas').getLayer(idSouth) != undefined) {
            $('#canvas').removeLayer(idSouth + '-plus-north');
            $('#canvas').drawLayers();
        }
        var idWest = createElementID(positionX - 1, positionY);
        if($('#canvas').getLayer(idWest) != undefined) {
            $('#canvas').removeLayer(idWest + '-plus-east');
            $('#canvas').drawLayers();
        }
   
        var createElement = $('#canvas').getLayer(id);
        if((direction == Direction.none) || (createElement == undefined)) {
            $('#canvas').drawRect({
                name: id,
                groups: [id],
                layer: true,
                // fillStyle: '#ffffff',
                x: x,
                y: y,
                width: defaultWidth,
                height: defaultHeight,
                data: data,
                contextmenu: function(layer) {
                    targetElement = layer
                    $('#menu01').css('visibility', 'hidden');
                    if($('#canvas').height() * 0.75 > layer.eventY) {
                        $('#menu01').css('top', layer.eventY);
                    }
                    else {
                        $('#menu01').css('top', layer.eventY - $('#menu01')[0].clientHeight);
                    }
                    if($('#canvas').width() * 0.75 > layer.eventX) {
                        $('#menu01').css('left', layer.eventX);
                    }
                    else {
                        $('#menu01').css('left', layer.eventX - $('#menu01')[0].clientWidth);
                    }
                    $('#menu01').css('visibility', 'visible');
                },
                click: function() {
                    $('#menu01').css('visibility', 'hidden');
                }
            });
        
            var element = $('#canvas').getLayer(id);
        
            drawStroke(element);

            drawPlusIcon(element);

            $('#canvas').drawText({
                name: id + '-text',
                groups: [id],
                layer: true,
                fillStyle: 'black',
                x: x,
                y: y,
                fontSize: 14,
                // fontFamily: 'Verdana, sans-serif',
                text: id
            });
        
            stackElements[id] = element;
            console.log(stackElements);
        }        
    }
}

function removeElement() {
    console.log("removeElement")
    console.log(targetElement)
    var positionX = targetElement.data.x;
    var positionY = targetElement.data.y;
    var element = undefined

    // 追加Element周辺Element「＋」制御
    var idNorth = createElementID(positionX, positionY + 1);
    element = $('#canvas').getLayer(idNorth);
    if(element != undefined) {
        drawPlusIcon(element);
        element.data.join.south = false;
        drawStroke(element);
        $('#canvas').drawLayers();
    }
    var idEast = createElementID(positionX + 1, positionY);
    element = $('#canvas').getLayer(idEast);
    if($('#canvas').getLayer(idEast) != undefined) {
        drawPlusIcon(element);
        element.data.join.west = false;
        drawStroke(element);
        $('#canvas').drawLayers();
    }
    var idSouth = createElementID(positionX, positionY - 1);
    element = $('#canvas').getLayer(idSouth);
    if($('#canvas').getLayer(idSouth) != undefined) {
        drawPlusIcon(element);
        element.data.join.north = false;
        drawStroke(element);
        $('#canvas').drawLayers();
    }
    var idWest = createElementID(positionX - 1, positionY);
    element = $('#canvas').getLayer(idWest);
    if($('#canvas').getLayer(idWest) != undefined) {
        drawPlusIcon(element);
        element.data.join.east = false;
        drawStroke(element);
        $('#canvas').drawLayers();
    }
}

function drawStroke(element) {
    $('#canvas').removeLayerGroup(element.name + '-line')
    $('#canvas').drawLayers();

    if(element.data.join.north == false) {
        $('#canvas').drawLine({
            groups: [element.name, element.name + '-line'],
            layer: true,
            strokeStyle: '#000000',
            strokeWidth: 1,
            x1: element.x - element.width / 2,
            y1: element.y - element.height /2,
            x2: element.x + element.width / 2,
            y2: element.y - element.height /2
        });
    }

    if(element.data.join.east == false) {
        $('#canvas').drawLine({
            groups: [element.name, element.name + '-line'],
            layer: true,
            strokeStyle: '#000000',
            strokeWidth: 1,
            x1: element.x + element.width / 2,
            y1: element.y - element.height /2,
            x2: element.x + element.width / 2,
            y2: element.y + element.height /2
        });
    }

    if(element.data.join.south == false) {
        $('#canvas').drawLine({
            groups: [element.name, element.name + '-line'],
            layer: true,
            strokeStyle: '#000000',
            strokeWidth: 1,
            x1: element.x - element.width / 2,
            y1: element.y + element.height /2,
            x2: element.x + element.width / 2,
            y2: element.y + element.height /2
        });
    }

    if(element.data.join.west == false) {
        $('#canvas').drawLine({
            groups: [element.name, element.name + '-line'],
            layer: true,
            strokeStyle: '#000000',
            strokeWidth: 1,
            x1: element.x - element.width / 2,
            y1: element.y - element.height /2,
            x2: element.x - element.width / 2,
            y2: element.y + element.height /2
        });
    }
}

function drawPlusIcon(element) {
    var positionX = element.data.x;
    var positionY = element.data.y;
    var id = element.name;
    var x = element.x;
    var y = element.y;
    if($('#canvas').getLayer(createElementID(positionX, positionY + 1)) == undefined) {
        $('canvas').drawImage({
            name: id + '-plus-north',
            groups: [id],
            layer: true,
            source: './asset/plus_16px.png',
            x: x, y: y - defaultHeight / 2 - 12,
            data: {
                id: id
            },click: function() {
                targetElement =  $('#canvas').getLayer(id);
                addElement(Direction.north);
            }
        });
    }

    if($('#canvas').getLayer(createElementID(positionX + 1, positionY)) == undefined) {
        $('canvas').drawImage({
            name: id + '-plus-east',
            groups: [id],
            layer: true,
            source: './asset/plus_16px.png',
            x: x + defaultWidth / 2 + 12, y: y,
            data: {
                id: id
            },click: function() {
                targetElement =  $('#canvas').getLayer(id);
                addElement(Direction.east);
            }
        });
    }

    if(positionY > 0 && $('#canvas').getLayer(createElementID(positionX, positionY - 1)) == undefined) {
        $('canvas').drawImage({
            name: id + '-plus-south',
            groups: [id],
            layer: true,
            source: './asset/plus_16px.png',
            x: x, y: y + defaultHeight / 2 + 12,
            data: {
                id: id
            },click: function() {
                targetElement =  $('#canvas').getLayer(id);
                addElement(Direction.south);
            }
        });
    }
    
    if(positionX > 0 && $('#canvas').getLayer(createElementID(positionX - 1, positionY)) == undefined) {
        $('canvas').drawImage({
            name: id + '-plus-west',
            groups: [id],
            layer: true,
            source: './asset/plus_16px.png',
            x: x - defaultWidth / 2 - 12, y: y,
            data: {
                id: id
            },click: function() {
                targetElement =  $('#canvas').getLayer(id);
                addElement(Direction.west);
            }
        });
    }

}

function resizeCanvas() {
    $('#canvas').attr("width", $('#canvas_width').val())
    $('#canvas').attr("height", $('#canvas_height').val())
    $('#canvas').drawLayers();
}