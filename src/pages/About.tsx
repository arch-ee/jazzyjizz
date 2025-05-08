
import Main from "../components/Layout/Main";

const About = () => {
  return (
    <Main>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">About Candy Commerce Carnival</h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="candy-card p-8 mb-8">
              <p className="text-lg mb-4">
                Welcome to Candy Commerce Carnival, your ultimate destination for all things sweet and delicious! 
                We are passionate about bringing joy through our carefully curated selection of high-quality candies.
              </p>
              <p className="text-lg mb-4">
                Our journey began with a simple dream: to create a candy wonderland where people of all ages could 
                find their favorite treats and discover new flavors that would delight their taste buds.
              </p>
              <p className="text-lg">
                From classic chocolates to innovative gummy creations, we strive to offer a diverse range of products 
                that cater to every preference and dietary need.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Our Sweet Philosophy</h2>
            <p className="text-gray-600">What makes our candy store special</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="candy-card p-6 text-center">
              <div className="w-16 h-16 bg-candy-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Ingredients</h3>
              <p className="text-gray-600">
                We source only the finest ingredients to ensure that every piece of candy is a delightful experience.
              </p>
            </div>

            <div className="candy-card p-6 text-center">
              <div className="w-16 h-16 bg-candy-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Trade</h3>
              <p className="text-gray-600">
                We believe in ethical sourcing and support fair trade practices to create a positive impact.
              </p>
            </div>

            <div className="candy-card p-6 text-center">
              <div className="w-16 h-16 bg-candy-mint rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Crafted with Love</h3>
              <p className="text-gray-600">
                Each candy is selected with care and passion to bring you the most delightful treats.
              </p>
            </div>
          </div>
        </section>
        
        <section className="max-w-3xl mx-auto">
          <div className="candy-card p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Commitment to You</h2>
            
            <p className="text-lg mb-4">
              At Candy Commerce Carnival, we are committed to:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Providing exceptional quality candies that create moments of joy</li>
              <li>Offering excellent customer service and a seamless shopping experience</li>
              <li>Continuously expanding our selection to bring you new and exciting treats</li>
              <li>Being transparent about our ingredients and sourcing practices</li>
              <li>Supporting sustainable packaging solutions whenever possible</li>
            </ul>
            
            <p className="text-lg">
              Thank you for choosing Candy Commerce Carnival as your sweet destination. We look forward to being 
              part of your joyful moments and celebrations!
            </p>
          </div>
        </section>
      </div>
    </Main>
  );
};

export default About;
