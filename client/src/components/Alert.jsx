import React, { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    alert('This app was built by UniqueOlga and OlgaCodes associates. No rights to reproduce or copy. Also, your data is safe ^_^');
  }, []); // The empty array [] means this effect runs only once when the component mounts.

  // Your component's JSX here
}

export default MyComponent;
