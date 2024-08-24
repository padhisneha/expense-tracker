import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  
  // Check if the request is for the admin page
  if (url.pathname === '/admin') {
    const auth = req.headers.get('authorization');
    
    if (!auth) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }

    const [username, password] = atob(auth.split(' ')[1]).split(':');

    // Replace 'admin' and 'password' with your desired credentials
    if (username === 'admin' && password === 'password') {
      return NextResponse.next(); // Allow the request to proceed
    } else {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }
  }

  return NextResponse.next(); // Allow all other requests
}
