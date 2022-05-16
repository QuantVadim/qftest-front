//Присеты оценивания
export default[
    {
        name: 'procent',
        fullName: '100% система оценивания',
        label: '100-процентное',
        bits: 100,
        body: [] //Особое оценивание. параметры не нужны
    },
    {
        name: 'point5',
        label: '5-бальное',
        fullName: '5-бальная система оценивания',
        bits: 4,
        body: [
            {value: 0, label: '2', description: 'Неуд.'},
            {value: 60, label: '3', description: 'Удовлет.'},
            {value: 80, label: '4', description: 'Хорошо'},
            {value: 90, label: '5', description: 'Отлично'}
        ]
    },
    {
        name: 'star3',
        label: '3-х звёздочное',
        fullName: '3-х звёздочная система оценивания',
        bits: 4,
        body: [
            {value: 0, label: '2', description: 'Неуд.'},
            {value: 60, label: '3', description: 'Удовлет.'},
            {value: 80, label: '4', description: 'Хорошо'},
            {value: 90, label: '5', description: 'Отлично'}
        ]
    },
]