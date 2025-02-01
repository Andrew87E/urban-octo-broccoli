# Dynamic Location-Based State Explorer

A vanilla JavaScript application that provides dynamic, location-based information about U.S. states and cities. The app detects your location through IP geolocation and automatically customizes the content to show information about your current state and nearby cities.

## Features

- **Dynamic Location Detection**: Automatically detects your location through IP geolocation
- **VPN Compatible**: Test different state views by connecting through a VPN
- **Real-time Data**: Pulls current information from multiple reliable sources:
  - Custom API server for precise IP geolocation
  - GeoNames API for geographical and population data
  - Wikipedia API for detailed state and city information
- **Interactive UI**:
  - Dark/Light theme toggle
  - Population statistics
  - Top 10 cities listing
  - Geographic information
  - Custom contact form

## Built With

* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
* [![JQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com)

## Try It Out

1. Visit the live site
2. Notice how it displays information for your current location
3. Connect to a VPN in a different state
4. Refresh the page to see content dynamically update for the new location

## Key Features

- **State Information**:
  - Comprehensive state overview from Wikipedia
  - Current population statistics
  - Geographic data and coordinates
  - Capital city information
  - Top 10 most populated cities

- **City Information**:
  - Detailed city descriptions from Wikipedia
  - Population data from GeoNames
  - Geographic coordinates
  - Local time zone information
  - Elevation data

- **Interactive Features**:
  - Responsive design
  - Theme switching
  - Contact form with validation
  - Local storage for improved performance
  - Loading states and error handling

## Getting Started

### Prerequisites
- Web browser
- Internet connection
- (Optional) VPN service for testing different locations

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/your_username/your_repo.git
   ```
2. Navigate to the project directory
   ```sh
   cd your_repo
   ```
3. Open index.html in your browser or use a local server
   ```sh
   python -m http.server 8000
   # or
   php -S localhost:8000
   ```

## Usage

The application automatically:
1. Detects your location through IP geolocation
2. Loads relevant state information
3. Displays nearby cities
4. Shows population statistics
5. Provides interactive elements for exploring more information

Try connecting through a VPN to different states to see how the content dynamically updates!

## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

## Contact

Andrew Edwards - [LinkedIn](https://www.linkedin.com/in/andrew-edwards-software-engineer/)

[![LinkedIn][linkedin-shield]][linkedin-url]

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/andrew-edwards-software-engineer/
