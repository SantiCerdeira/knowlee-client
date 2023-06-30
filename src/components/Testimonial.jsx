import React, { useState } from "react";

const TestimonialGallery = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);

  const testimonialData = [
    {
      id: 1,
      name: "Juan Pérez",
      testimonial:
        "Knowlee me ha ayudado a aprender matemáticas de una manera sencilla y divertida.",
      img: "juan.png",
    },
    {
      id: 2,
      name: "María Gómez",
      testimonial:
        "Gracias a Knowlee, he mejorado mis habilidades de programación y ahora puedo desarrollar mis propias aplicaciones.",
      img: "maria.png",
    },
    {
      id: 3,
      name: "Luis Torres",
      testimonial:
        "Con Knowlee, he descubierto mi pasión por la historia y he aprendido detalles fascinantes sobre diferentes épocas.",
      img: "luis.png",
    },
    {
      id: 4,
      name: "Ana López",
      testimonial:
        "Knowlee es una herramienta imprescindible para mi aprendizaje de idiomas. He mejorado mi fluidez y vocabulario en poco tiempo.",
      img: "ana.png",
    },
    {
      id: 5,
      name: "Carlos Rodríguez",
      testimonial:
        "Gracias a Knowlee, ahora tengo un amplio conocimiento sobre biología y entiendo mejor el funcionamiento del mundo natural.",
      img: "carlos.png",
    },
    {
      id: 6,
      name: "Laura Sánchez",
      testimonial:
        "Soy estudiante de arte y Knowlee me ha brindado inspiración y recursos para expandir mi creatividad.",
      img: "laura.png",
    },
    {
      id: 7,
      name: "Pedro Fernández",
      testimonial:
        "Con Knowlee, he aprendido técnicas de fotografía que han mejorado la calidad de mis imágenes.",
      img: "pedro.png",
    },
    {
      id: 8,
      name: "Sofía Ramírez",
      testimonial:
        "Gracias a Knowlee, ahora puedo entender conceptos complejos de física de forma clara y concisa.",
      img: "sofia.png",
    },
    {
      id: 9,
      name: "Héctor Medina",
      testimonial:
        "Knowlee me ha permitido descubrir nuevas pasiones y aprender sobre diversos temas de manera autodidacta.",
      img: "hector.png",
    },
    {
      id: 10,
      name: "Isabel Vargas",
      testimonial:
        "Con Knowlee, he ampliado mis conocimientos sobre literatura y descubierto nuevos autores fascinantes.",
      img: "isabel.png",
    },
    {
      id: 11,
      name: "Diego Navarro",
      testimonial:
        "Knowlee me ha ayudado a mejorar mis habilidades de música y a componer mis propias canciones.",
      img: "diego.png",
    },
    {
      id: 12,
      name: "Fernanda López",
      testimonial:
        "Gracias a Knowlee, ahora tengo una base sólida de conocimientos en química que me ha sido útil en mis estudios.",
      img: "fernanda.png",
    },
  ];

  const handlePersonClick = (personId) => {
    setSelectedPerson(personId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-6 justify-center">
        {testimonialData.map((person) => (
          <div
            key={person.id}
            className={`overflow-hidden cursor-pointer w-3/12 md:w-2/12 lg:w-2/12 xl:w-1/12`}
            onClick={() => handlePersonClick(person.id)}
          >
            <img
              src={`/img/${person.img}`}
              alt={`Person ${person.id}`}
              className={`w-24 h-24 object-cover rounded-full  ${
                selectedPerson === person.id ? "border-4 border-blue-400" : ""
              }`}
            />
          </div>
        ))}
      </div>

      {selectedPerson && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-2">
            {testimonialData[selectedPerson - 1].name}
          </h3>
          <p className="text-lg">
            {testimonialData[selectedPerson - 1].testimonial}
          </p>
          <div className="flex justify-center gap-1 my-6">
            <i className="fa-solid fa-star fa-xl"></i>
            <i className="fa-solid fa-star fa-xl"></i>
            <i className="fa-solid fa-star fa-xl"></i>
            <i className="fa-solid fa-star fa-xl"></i>
            <i className="fa-solid fa-star fa-xl"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialGallery;
