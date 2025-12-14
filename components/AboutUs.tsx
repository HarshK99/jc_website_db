export default function AboutUs() {
  const aboutData = {
    brand: "JNC Group",
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
    description: "\"JNC Group\" is a brand name of the book publishing segment of J&C Newspaper Group, a leading publisher of general books. Its registered office stands in Guwahati. This group was set up in February 2008. The full name of our publishing house is Jobs and Careers Newspaper Group. It is generally shortened as J&C Books or jncnews.in or JNC Group. We deal in educational and career related books.",
    philosophy: "In fact, both good jobs and good people are not easy to find. While good people do always dream, perform and deliver the goods, good organisations demand for such a suitable working force. Without good people, a company can cruddle like a house of cards. It can't even grow without them. Because it is the vision of its people that defines and directs the rise or fall of corporate entities."
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About {aboutData.brand}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 font-medium">
            {aboutData.tagline}
          </p>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        {/* Quote Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Inspiring Wisdom</h3>
          <div className="space-y-4 mb-6 max-w-4xl mx-auto text-center">
            {aboutData.quote.creativityLines.map((line, index) => (
              <p key={index} className="text-lg text-gray-700 italic leading-relaxed">
                "{line}"
              </p>
            ))}
          </div>
          <span className="text-base text-gray-600 font-medium block text-center">
            — {aboutData.quote.attribution}
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {/* Philosophy Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Philosophy</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {aboutData.philosophy}
            </p>
          </div>

          {/* Company Overview Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Overview</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {aboutData.description}
            </p>
          </div>
        </div>

        
      </div>
    </section>
  );
}