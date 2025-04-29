
import { Link } from 'react-router-dom';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number | string;
  imageUrl: string;
}

const EventCard = ({ id, title, date, time, location, price, imageUrl }: EventCardProps) => {
  return (
    <Link to={`/event/${id}`} className="group">
      <div className="card-noir group-hover:scale-[1.01] transition-transform duration-200">
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/80 uppercase tracking-wider mb-1">Event</p>
                <h3 className="text-white font-bold text-lg line-clamp-1">{title}</h3>
              </div>
              <div className="bg-black/60 px-2 py-1 rounded">
                <p className="text-white font-medium">
                  {typeof price === 'number' ? `रु ${price.toLocaleString('en-NP')}` : price}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
