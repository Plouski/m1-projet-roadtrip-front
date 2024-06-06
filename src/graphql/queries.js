export const GET_ROADTRIPS = `
    query getRoadtrips {
        getRoadtrips {
            id
            title
            description
            duration
        }
    }
`;

export const GET_PROFIL = `
    query getProfil {
        getProfil {
            id
            email
            firstname
            lastname
        }
    }
`;

export const GET_MY_ROADTRIPS = `
    query getMyRoadtrips {
        getMyRoadtrips {
            id
            title
            description
            duration
        }
    }
`;

export const GET_DURATION_OPTIONS = `
    query GetDurationOptions {
        getRoadtrips {
        duration
        }
  }
`;
