export const REGISTER_USER = `
    mutation register($user: UserInput!) {
        register(user: $user) {
            token
        }
    }
`

export const LOGIN_USER = `
    mutation login($user: UserInput!) {
        login(user: $user) {
            token
        }
    }
`

export const CREATE_ROADTRIP = `
    mutation createRoadtrip($roadtrip: RoadtripInput!) {
        createRoadtrip(roadtrip: $roadtrip) {
            id
            title
            description
            duration
            user_id
            image
        }
    }
`

export const UPDATE_ROADTRIP = `
    mutation updateRoadtrip($id: ID!, $roadtrip: RoadtripInput!) {
        updateRoadtrip(id: $id, roadtrip: $roadtrip) {
            id
            title
            description
            duration
            user_id
            image
        }
    }
`;

export const DELETE_ROADTRIP = `
    mutation deleteRoadtrip($id: ID!) {
        deleteRoadtrip(id: $id) {
            success
            message
        }
    }
`

export const DELETE_ROADTRIPSTEP = `
    mutation deleteRoadtripStep($id: ID!) {
        deleteRoadtripStep(id: $id) {
            success
            message
        }
    }
`

export const CREATE_ROADTRIPSTEP = `
    mutation createRoadtripStep($roadtripstep: RoadtripStepInput!) {
        createRoadtripStep(roadtripstep: $roadtripstep) {
            id
            roadtrip_id
            title
            location
            description
            
        }
    }
`

export const UPDATE_ROADTRIPSTEP = `
    mutation updateRoadtripStep($id: ID!, $roadtripstep: RoadtripStepInput!) {
        updateRoadtripStep(id: $id, roadtripstep: $roadtripstep) {
            id
            roadtrip_id
            title
            location
            description
            
        }
    }
`; 