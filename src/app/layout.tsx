import Header from '../components/partials/Header';
import Footer from '../components/partials/Footer';
import { Poppins } from 'next/font/google';
import {WishlistContextProvider} from '../context/WishlistContext';

const poppins = Poppins(
  { 
    subsets: ['latin'],
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  },
)

interface IProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: IProps) {
	return (
		<html lang="en">
			<body className={`${poppins.className}`}>
				<WishlistContextProvider>
					<Header />
					<main>{children}</main>
					<Footer />
				</WishlistContextProvider>				
			</body>
		</html>
	);
}
