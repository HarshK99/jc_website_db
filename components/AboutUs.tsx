export default function AboutUs() {
  const aboutData = {
    brand: "J&C Books",
    division: "Informatica",
    tagline: "Right information to a right person at the right time",
    quote: {
      creativityLines: [
      "When learning is purposeful, creativity blossoms",
      "When creativity blossoms, thinking emanates",
      "When thinking emanates, knowledge is fully lit.",
      "When knowledge is fully lit, personality flourishes."
    ],
      attribution: "Dr. Avul Pakir Jainulabdeen Abdul Kalam, Former President and Missile Man of India"
    },
    description: "\"J&C Books\" is a brand name of the book publishing segment of J&C Newspaper Group, a leading publisher of general books. Its registered office stands in Guwahati. This group was set up in February 2008.",
    philosophy: "In fact, both good jobs and good people are not easy to find. While good people do always dream, perform and deliver the goods, good organisations demand for such a suitable working force. Without good people, a company can cruddle like a house of cards. It can't even grow without them. Because it is the vision of its people that defines and directs the rise or fall of corporate entities."
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About {aboutData.brand}
          </h2>
          <p className="text-xl text-indigo-700 max-w-4xl mx-auto mb-8 font-medium">
            {aboutData.tagline}
          </p>
          <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
        </div>
        {/* Quote Section */}
        <div className="bg-white p-10 rounded-xl shadow-lg text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Inspiring Wisdom</h3>
          </div>
          <div className="space-y-4 mb-8 max-w-4xl mx-auto">
            {aboutData.quote.creativityLines.map((line, index) => (
              <p key={index} className="text-xl text-gray-700 italic font-medium leading-relaxed">
                "{line}"
              </p>
            ))}
          </div>
          <cite className="text-lg text-gray-600 font-semibold block">
            — {aboutData.quote.attribution}
          </cite>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-15">
          {/* Philosophy Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Philosophy</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              {aboutData.philosophy}
            </p>
          </div>

          {/* Company Overview Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Company Overview</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              {aboutData.description}
            </p>
          </div>
        </div>

        
      </div>
    </section>
  );
}