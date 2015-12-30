var date = new Date();
module.exports = [
    // Users
    {
        model: 'User',
        data: {
            id: 1,
            username: 'geocoach_api',
            password: 'qwerty',
            role: 'admin',
            slug: 'geocoach_api'
        }
    },
    {
        model: 'User',
        data: {
            id: 2,
            username: 'geocoach_api2',
            password: 'qwerty',
            role: 'admin',
            slug: 'geocoach_api2'
        }
    },
    // Test token!
    {
        model: 'Token',
        data: {
            id: 1,
            expirationDate: new Date((date.getTime() + 1000*60*60*24*30)),
            accessToken: 'tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9',
            UserId: 1
        }
    },
    {
        model: 'Token',
        data: {
            id: 2,
            expirationDate: new Date((date.getTime() + 1000*60*60*24*30)),
            accessToken: 'tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8',
            UserId: 2
        }
    },
    // Entries
    {
        model: 'EndpointEntry',
        data: {
            id: 1,
            path: '/user/:id/:code',
            slug: 'geocoach_api',
            processTime: 14,
            code: 201,
            method: 'POST'
        }
    },
    {
        model: 'EndpointEntry',
        data: {
            id: 2,
            path: '/user/:id/:code',
            slug: 'geocoach_api',
            processTime: 14,
            code: 400,
            method: 'POST'
        }
    },
    {
        model: 'EndpointEntry',
        data: {
            id: 3,
            path: '/auth/:id/:code',
            slug: 'geocoach_api',
            processTime: 14,
            code: 409,
            method: 'POST'
        }
    },
    {
        model: 'EndpointEntry',
        data: {
            id: 4,
            path: '/user/:id/:code',
            slug: 'geocoach_api',
            processTime: 14,
            code: 204,
            method: 'POST'
        }
    },
    {
        model: 'EndpointEntry',
        data: {
            id: 5,
            path: '/auth/:id/:code',
            slug: 'geocoach_api',
            processTime: 14,
            code: 401,
            method: 'POST'
        }
    },
    {
        model: 'EndpointEntry',
        data: {
            id: 6,
            path: '/user/:id/:code',
            slug: 'geocoach_api',
            processTime: 14,
            code: 403,
            method: 'POST'
        }
    },
    {
        model: 'EndpointEntry',
        data: {
            id: 7,
            path: '/user/:id/:code',
            slug: 'geocoach_api',
            processTime: 14,
            code: 204,
            method: 'POST'
        }
    },
    {
        model: 'EndpointEntry',
        data: {
            id: 8,
            path: '/auth/:id/:code',
            slug: 'geocoach_api',
            processTime: 14,
            code: 401,
            method: 'POST'
        }
    },
    {
        model: 'EndpointEntry',
        data: {
            id: 9,
            path: '/user/:id/:code',
            slug: 'geocoach_api',
            processTime: 14,
            code: 403,
            method: 'POST'
        }
    }
];