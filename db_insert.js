'use strict';

var mongoose = require('mongoose');
var Category = require('./app/models/category')(mongoose);

mongoose.connect('mongodb://localhost/stereo_glass');

var colors = [
    {
        value: "red",
        icon: "glyphicon-stop sg-red-i",
        subtext: "Красный"
    },
    {
        value: "orange",
        icon: "glyphicon-stop sg-orange-i",
        subtext: "Оранжевый"
    },
    {
        value: "brown",
        icon: "glyphicon-stop sg-brown-i",
        subtext: "Коричневый"
    },
    {
        value: "yellow",
        icon: "glyphicon-stop sg-yellow-i",
        subtext: "Жёлтый"
    },
    {
        value: "green",
        icon: "glyphicon-stop sg-green-i",
        subtext: "Зелёный"
    },
    {
        value: "blue",
        icon: "glyphicon-stop sg-blue-i",
        subtext: "Синий"
    },
    {
        value: "magenta",
        icon: "glyphicon-stop sg-magenta-i",
        subtext: "Фиолетовый"
    },
    {
        value: "black",
        icon: "glyphicon-stop sg-black-i",
        subtext: "Ч/Б"
    },
    {
        value: "multicolor",
        icon: "glyphicon-stop sg-multicolor-i",
        subtext: "Многоцветный"
    }
];

//Category.addTo('colors', '', colors);

var assortment = [
    {
        name: 'Часы',
        value: 'watches'
    },
    {
        name: 'Подносы',
        value: 'trays'
    },
    {
        name: 'Светильники',
        value: 'lamps'
    },
    {
        name: 'Рекламная продукция',
        value: 'adverts'
    }
];

var assortmentPannos = [
    {
        name: 'Горизонтальные',
        value: "horizontal-pannos"
    },
    {
        name: 'Вертикальные',
        value: "vertical-pannos"
    },
    {
        name: 'Панорамные',
        value: "panoramic-pannos"
    }

];

var assortmentTiles = [
    {
        name: 'Настенная',
        value: "wall-tiles"
    },
    {
        name: 'Напольная',
        value: "floor-tiles"
    }
];

//Category.addTo('assortment', '', assortment);
//Category.addTo('assortment', 'Плитка', assortmentTiles);
//Category.addTo('assortment', 'Панно', assortmentPannos);


var plots = [
    {
        name: "Торговые марки",
        value: "trademarks"
    },
    {
        name: "Спорт",
        value: "sport"
    },
    {
        name: "Милитари",
        value: "military"
    },
    {
        name: "Фольклор",
        value: "folklore"
    },
    {
        name: "Для малышей",
        value: "children"
    },
    {
        name: "Архитектура",
        value: "architecture"
    },
    {
        name: "Повторяющиеся мотивы",
        value: "repeating"
    },
    {
        name: "Камень",
        value: "stone"
    },
    {
        name: "Животные",
        value: "animals"
    },
    {
        name: "Предметы",
        value: "things"
    },
    {
        name: "Абстракции",
        value: "abstract"
    }
];

var plotsLandscapes = [
    {
        name: "Лес",
        value: "forest"
    },
    {
        name: "Цветы и растения",
        value: "plants-flowers"
    },
    {
        name: "На берегу",
        value: "seacoast"
    },
    {
        name: "В глубинах вод",
        value: "under-the-sea"
    },
    {
        name: "Прочее",
        value: "landscapes-other"
    }
];

var countries = [
    {
        name: "Международный",
        value: "international"
    },
        {
        name: "Азия",
        value: "asia"
    },
    {
        name: "Ближний восток",
        value: "neareast"
    },
    {
        name: "Европа",
        value: "europe"
    },
    {
        name: "Африка",
        value: "africa"
    },
    {
        name: "США",
        value: "usa"
    },
    {
        name: "Южная Америка",
        value: "southamerica"
    },
    {
        name: "Индия",
        value: "india"
    },
    {
        name: "Израиль",
        value: "israel"
    }
];

var slavic = [
    {
        name: "Россия",
        value: "russia"
    },
    {
        name: "Украина",
        value: "ukraine"
    },
    {
        name: "Беларусь",
        value: "belarus"
    },   
];

//Category.addTo('plots', '', plots);
//Category.addTo('plots', 'Пейзажи и море', plotsLandscapes);

Category.addTo('countries', '', countries);
Category.addTo('countries', 'slavic', slavic);
