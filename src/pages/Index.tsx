
import ProductGrid from "../components/Products/ProductGrid";
import { useProducts } from "../context/ProductContext";
import Main from "../components/Layout/Main";

const Index = () => {
  const { products } = useProducts();

  return (
    <Main>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="bg-gradient-to-r from-candy-pink via-candy-blue to-candy-purple rounded-xl overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Welcome to the Candy Commerce Carnival!
                </h1>
                <p className="text-lg mb-6">
                  Discover a world of sweetness with our delicious selection of candies and treats. 
                  From chocolates to gummies, we have everything to satisfy your sweet tooth!
                </p>
                <div>
                  <a 
                    href="#products" 
                    className="inline-block bg-white hover:bg-gray-100 text-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 relative min-h-[300px] md:min-h-0">
                <img 
                  src="/placeholder.svg" 
                  alt="Candy display" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Sweet Collection</h2>
            <p className="text-gray-600">
              Browse our delicious selection of candies and sweet treats!
            </p>
          </div>
          
          <ProductGrid products={products} />
        </section>

        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="candy-card p-6 text-center">
            <div className="w-16 h-16 bg-candy-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Get your sweet treats delivered quickly to your doorstep.
            </p>
          </div>

          <div className="candy-card p-6 text-center">
            <div className="w-16 h-16 bg-candy-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">
              We ensure all our candies are of the highest quality.
            </p>
          </div>

          <div className="candy-card p-6 text-center">
            <div className="w-16 h-16 bg-candy-mint rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Love</h3>
            <p className="text-gray-600">
              Join thousands of satisfied sweet-toothed customers.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="candy-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Sign up for Sweet Deals!
                </h2>
                <p className="mb-6">
                  Be the first to know about our new products, special offers, and candy deals.
                </p>
                <form className="flex flex-col md:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 rounded-lg border flex-grow"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-candy-purple to-candy-pink text-white rounded-lg hover:from-candy-pink hover:to-candy-purple transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
              <div className="bg-candy-peach flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">20% OFF</div>
                  <div className="text-xl md:text-2xl">Your First Order</div>
                  <div className="mt-4 text-sm">Use code: SWEET20</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Main>
  );
};

export default Index;
