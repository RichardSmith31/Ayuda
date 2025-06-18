import React from 'react';
import './App.css';

import Dashboard from './components/Dashboard';
import Particles from './components/Particles/Particles';

function App() {

return (
    <div className='app'>
        <div className='particles-bg'>
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={500}
                particleSpread={10}
                speed={0.01}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
            />
        </div>
        <Dashboard/>
    </div>
);

}

export default App;
