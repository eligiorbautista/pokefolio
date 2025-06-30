# 🎮 PokeFolio - Your Personal Pokemon Portfolio

> Create your own personalized Pokemon profile page with a unique URL and share your favorite Pokemon with the world!

![PokeFolio Banner](https://img.shields.io/badge/Pokemon-Portfolio-FF6B6B?style=for-the-badge&logo=pokemon&logoColor=white)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

### 🎯 Core Features
- **Personalized URLs**: Get your own Pokemon profile page at `https://pokefolioph.vercel.app/registration`
- **Pokemon Selection**: Choose up to 6 favorite Pokemon from the original 151 (Gen 1)
- **Custom Profiles**: Write your own description and showcase your Pokemon collection
- **Real Pokemon Data**: Powered by the official [PokeAPI](https://pokeapi.co/)

### 🔐 Authentication & Security
- **Email/Password Authentication** via Supabase
- **Google OAuth** integration for quick sign-up
- **Password Reset** functionality
- **Account Management** with email updates and account deletion
- **Session Management** across devices

### 📱 User Experience
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Modern UI** with beautiful gradients and animations
- **Real-time Updates** with instant feedback
- **Toast Notifications** for user actions
- **Loading States** for better UX

### ⚙️ Technical Features
- **Server-Side Rendering** with SvelteKit
- **TypeScript** for type safety
- **Database Integration** with Supabase
- **Modern CSS** with Tailwind and DaisyUI
- **Component-Based Architecture**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/poke-page.git
   cd poke-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   
   Create a `profiles` table in your Supabase database:
   ```sql
   CREATE TABLE profiles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     email TEXT UNIQUE NOT NULL,
     description TEXT DEFAULT 'This is your profile description, feel free to write about yourself or your favorite Pokemons.',
     pokemon_ids INTEGER[] DEFAULT '{1,2,3}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- Create policies
   CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = user_id);
   ```

5. **Configure Supabase Authentication**
   - Enable Email authentication
   - Set up Google OAuth (optional)
   - Configure redirect URLs in Supabase dashboard

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
poke-page/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── EditModal.svelte      # Pokemon selection modal
│   │   ├── pokemonAPI.ts             # PokeAPI integration
│   │   └── index.ts                  # Library exports
│   ├── routes/
│   │   ├── [email]/
│   │   │   └── +page.svelte          # User profile pages
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── +page.svelte      # OAuth callback
│   │   ├── login/
│   │   │   └── +page.svelte          # Login page
│   │   ├── register/
│   │   │   └── +page.svelte          # Registration page
│   │   ├── settings/
│   │   │   └── +page.svelte          # Account settings
│   │   ├── forgot-password/
│   │   │   └── +page.svelte          # Password reset request
│   │   ├── reset-password/
│   │   │   └── +page.svelte          # Password reset form
│   │   ├── +layout.svelte            # Main layout with navigation
│   │   ├── +layout.ts                # Layout data loading
│   │   └── +page.svelte              # Home page
│   ├── app.css                       # Global styles
│   ├── app.html                      # HTML template
│   └── app.d.ts                      # Type definitions
├── static/
│   ├── favicon.png                   # Site favicon
│   └── pokeball.png                  # Pokeball icon
├── package.json                      # Dependencies and scripts
├── svelte.config.js                  # Svelte configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── vite.config.ts                    # Vite configuration
```

## 🛠️ Technology Stack

### Frontend
- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack web framework
- **[Svelte 5](https://svelte.dev/)** - Reactive UI components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[DaisyUI](https://daisyui.com/)** - Tailwind CSS components
- **[Svelte Sonner](https://github.com/wobsoriano/svelte-sonner)** - Toast notifications

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - Authentication (Email, OAuth)
  - PostgreSQL Database
  - Row Level Security
  - Real-time subscriptions

### External APIs
- **[PokeAPI](https://pokeapi.co/)** - Official Pokemon API for Pokemon data

### Build Tools
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixes

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev -- --open # Start dev server and open browser

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run check        # Run Svelte checks
npm run check:watch  # Run Svelte checks in watch mode
```

## 🌍 Deployment

This project can be deployed to various platforms:

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Add environment variables in Netlify dashboard

### Self-Hosted
1. Build the project: `npm run build`
2. Serve the `build` folder with any static server
3. Ensure environment variables are properly set

## 🔧 Configuration

### Environment Variables
```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For production
SUPABASE_SERVICE_KEY=your_service_key  # Server-side only
```

### Supabase Setup
1. Create a new Supabase project
2. Set up the database schema (see installation steps)
3. Configure authentication providers
4. Set up row-level security policies
5. Add your domain to allowed origins

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for custom colors and themes
- Update `src/app.css` for global styles
- Customize DaisyUI themes in the config

### Pokemon Limit
- Currently limited to first 151 Pokemon (Gen 1)
- Modify `pokemonAPI.ts` to include more generations
- Update the limit in `getPokemonList()` function

### Features
- Add more Pokemon details (moves, abilities, stats)
- Implement Pokemon favorites/ratings
- Add sharing functionality
- Include Pokemon search and filtering

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Eligio Bautista**  
🌐 Portfolio: [https://eligiobautista.dev](https://eligiobautista.dev)  
⚡ Building amazing web experiences with modern technologies

## 🙏 Acknowledgments

- **[coopercodes](https://github.com/coopercodes)** for the original inspiration - this project is a recreation of his work with additional features and enhanced security
- [PokeAPI](https://pokeapi.co/) for providing the Pokemon data
- [Supabase](https://supabase.com/) for the backend infrastructure
- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- The Pokemon Company for creating the amazing Pokemon universe

## 📞 Support

If you have any questions or need help setting up the project, please:
- Open an issue on GitHub
- Check the documentation links provided
- Review the Supabase and SvelteKit documentation

---

**Made with ❤️ and Pokemon power!** ⚡

![Pokemon](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png)
