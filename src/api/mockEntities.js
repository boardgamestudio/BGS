// Mock entities to replace Base44 API calls temporarily
// This will allow the app to load without Base44 dependency

export const Project = {
  list: async (sort, limit) => {
    return [
      {
        id: '1',
        title: 'Medieval Kingdom Builder',
        description: 'A strategic city-building game set in medieval times',
        created_by: 'designer@boardgamestudio.com',
        created_date: '2024-01-15',
        tags: ['Strategy', 'City Building'],
        image_url: 'https://via.placeholder.com/300x200?text=Medieval+Kingdom'
      },
      {
        id: '2', 
        title: 'Space Colony Expansion',
        description: 'Colonize planets and build your space empire',
        created_by: 'creator@boardgamestudio.com',
        created_date: '2024-01-10',
        tags: ['Sci-Fi', 'Strategy'],
        image_url: 'https://via.placeholder.com/300x200?text=Space+Colony'
      }
    ];
  },
  filter: async (params) => {
    return [];
  }
};

export const Job = {
  list: async (sort, limit) => {
    return [
      {
        id: '1',
        title: 'Game Artist Needed',
        description: 'Looking for talented artist for fantasy board game',
        company: 'Indie Games Studio',
        location: 'Remote',
        created_date: '2024-01-12',
        type: 'Contract'
      }
    ];
  }
};

export const Event = {
  list: async (sort, limit) => {
    return [
      {
        id: '1',
        title: 'Board Game Design Workshop',
        description: 'Learn the basics of board game design',
        date: '2024-02-15',
        location: 'Online',
        created_date: '2024-01-08'
      }
    ];
  }
};

export const ForumPost = {
  list: async (sort, limit) => {
    return [];
  }
};

export const ServiceProvider = {
  list: async (sort, limit) => {
    return [];
  }
};

export const DesignDiary = {
  filter: async (params) => {
    return [
      {
        id: '1',
        title: 'Getting Started with Board Game Design',
        content: 'A comprehensive guide to beginning your board game design journey',
        author_id: '1',
        is_published: true,
        created_date: '2024-01-05'
      }
    ];
  }
};

export const User = {
  list: async (sort, limit) => {
    return [
      {
        id: '1',
        email: 'designer@boardgamestudio.com',
        name: 'Board Game Designer',
        profile_picture: 'https://via.placeholder.com/100x100?text=User'
      },
      {
        id: '2', 
        email: 'creator@boardgamestudio.com',
        name: 'Game Creator',
        profile_picture: 'https://via.placeholder.com/100x100?text=User2'
      }
    ];
  },
  filter: async (params) => {
    return [];
  },
  me: async () => {
    // Return null to simulate not logged in
    return null;
  }
};
