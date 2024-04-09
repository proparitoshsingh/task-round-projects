import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchQuotes(9);
  }, []);

  const fetchQuotes = async (b) => {
    try {
      setIsLoading(true);
      const responses = await Promise.all(Array.from({ length: b }, () => fetch('https://api.quotable.io/random')));
      const jsonDatas = await Promise.all(responses.map(response => response.json()));
      setQuotes(prevQuotes => [...prevQuotes, ...jsonDatas]);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const lastele = entries[0];
      if (lastele.isIntersecting) {
        fetchQuotes(3);
      }
    }, {
      threshold: 1
    });

    const lastCard = document.querySelector('.card:last-child');
    if (lastCard) {
      observer.observe(lastCard);
    }

    return () => observer.disconnect();
  }, [quotes]);

  const getRandomColor = () => {
    const colors = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500','text-cyan-500','text-emerald-500','text-pink-500'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <div>
      <h1 className='font-bold text-3xl text-center underline text-gray-600 mt-4 hover:text-gray-700'>Infinite Scroll</h1>
      <p className="text-center text-gray-400 hover:scale-110 transition-transform">-By Paritosh Singh</p>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {quotes.map((quote, index) => (
              <div key={index} className={`card p-4 lg:w-1/3 transform hover:scale-105 transition duration-300 ease-in-out`}>
                <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative shadow-lg hover:shadow-xl">
                  <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">Quote {index + 1}</h2>
                  <h1 className={`${getRandomColor()} title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3`}>{quote.content}</h1>
                  <p className="leading-relaxed mb-3">-{quote.author}</p>
                </div>
              </div>

            ))}
          </div>
          {isLoading && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
