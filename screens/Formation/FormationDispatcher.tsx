import React from 'react';
import Monday from './Monday';
import Tuesday from './Tuesday';
import Wednesday from './Wednesday';
import Thursday from './Thursday';
import Friday from './Friday';
import Saturday from './Saturday';
import Sunday from './Sunday';

export default function FormationDispatcher(props: any) {
  const day = new Date().getDay();

  switch (day) {
    case 0: return <Sunday {...props} />;
    case 1: return <Monday {...props} />;
    case 2: return <Tuesday {...props} />;
    case 3: return <Wednesday {...props} />;
    case 4: return <Thursday {...props} />;
    case 5: return <Friday {...props} />;
    case 6: return <Saturday {...props} />;
    default: return <Monday {...props} />;
  }
}
