import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import FeaturedBlogs from "../components/FeaturedBlogs";
import FeaturedBooks from "../components/FeaturedBooks";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutUs />
      <FeaturedBlogs />
      <FeaturedBooks />
    </div>
  );
}
