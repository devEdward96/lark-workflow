const tables = [
    {
        id: 1,
        name: 'Users',
        columns: [
            {
                id: 1,
                name: 'ID',
                type: 'number',
            },
            {
                id: 2,
                name: 'Name',
                type: 'string',
            },
            {
                id: 3,
                name: 'Email',
                type: 'string',
            },
            {
                id: 4,
                name: 'Created At',
                type: 'date',
            },
        ],
    },
    {
        id: 2,
        name: 'Posts',
        columns: [
            {
                id: 1,
                name: 'ID',
                type: 'number',
            },
            {
                id: 2,
                name: 'Title',
                type: 'string',
            },
            {
                id: 3,
                name: 'Author',
                type: 'string',
            },
            {
                id: 4,
                name: 'Created At',
                type: 'date',
            },
        ],
    },
    {
        id: 3,
        name: 'Comments',
        columns: [
            {
                id: 1,
                name: 'ID',
                type: 'number',
            },
            {
                id: 2,
                name: 'Content',
                type: 'string',
            },
            {
                id: 3,
                name: 'Author',
                type: 'string',
            },
            {
                id: 4,
                name: 'Created At',
                type: 'date',
            },
        ],
    },
];

export default tables;