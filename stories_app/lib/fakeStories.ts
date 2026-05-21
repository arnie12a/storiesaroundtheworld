export type Story = {
    id: string;
    country: string;
    city: string;
    story_date: string;
    title: string;
    description: string;
    photo_url: string;
  };
  
  export const stories: Story[] = [
    {
      id: "1",
      country: "India",
      city: "Mumbai",
      story_date: "2023-12-10",
      title: "Monsoon Streets",
      description: "Walking through the monsoon-soaked streets of Mumbai felt electric.",
      photo_url: "/photos/hilton.jpg",
    },
    {
      id: "2",
      country: "Portugal",
      city: "Lisbon",
      story_date: "2024-03-22",
      title: "Sunset Over Alfama",
      description: "The golden light over the tiled rooftops was unforgettable.",
      photo_url: "/photos/saoVicente.jpg",
    },
    {
      id: "3",
      country: "Sri Lanka",
      city: "Ella",
      story_date: "2024-01-15",
      title: "Train Through the Clouds",
      description: "The blue train cutting through the misty mountains felt surreal.",
      photo_url: "/photos/elephant.jpg",
    },
  ];
  