# 🎮 PokeFolio

Create your own personalized Pokemon profile page and showcase your favorite Pokemon to the world!

## ✨ Features

- 🎯 **Choose Your Pokemon**: Select up to 3 favorite Pokemon from the original 151
- 🌐 **Unique Profile URL**: Get your own personalized Pokemon showcase page using your email
- 📝 **Custom Descriptions**: Write about yourself and your favorite Pokemon
- 🎨 **Beautiful Design**: Modern, responsive UI with Pokemon cards, types, and stats
- 📱 **Mobile Friendly**: Optimized for all devices
- 🔐 **User Authentication**: Secure login and registration with Supabase

## 🚀 Tech Stack

- **Frontend**: SvelteKit 5, TypeScript
- **Styling**: Tailwind CSS, DaisyUI  
- **Backend**: Supabase (Auth & Database)
- **API**: PokeAPI for Pokemon data
- **Deployment**: Vercel/Netlify ready

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pokefolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Building for Production

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## 🎮 How It Works

1. **Sign Up**: Create an account with your email
2. **Customize**: Choose up to 3 Pokemon and write your description  
3. **Share**: Your unique PokeFolio is available at `yourdomain.com/your-email`
4. **Showcase**: Friends can view your Pokemon collection and profile

## 📱 Demo

Visit a live example: `yourdomain.com/trainer@example.com`

---

Built with ❤️ and lots of ☕
