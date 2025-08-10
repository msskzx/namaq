'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../language/LanguageContext';
import { Battle } from '@/types/battle';
import { Loader } from '@googlemaps/js-api-loader';

interface BattleMapProps {
  battles: Battle[];
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  className?: string;
}

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 }; // Default to central Arabia
const DEFAULT_ZOOM = 5;

function BattleMap({
  battles = [],
  defaultCenter = DEFAULT_CENTER,
  defaultZoom = DEFAULT_ZOOM,
  className = 'h-[500px] w-full rounded-lg border border-gray-200 dark:border-gray-700',
}: BattleMapProps) {
  const { language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);

  useEffect(() => {
    // Initialize the map
    const initMap = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        console.error('Google Maps API key is not set');
        return;
      }

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.load();

        if (!mapRef.current) return;

        // Create the map instance
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: defaultZoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Add markers for battles if coordinates are available
        addBattleMarkers();
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    // Add markers for each battle
    const addBattleMarkers = () => {
      if (!mapInstance.current) return;

      // Clear existing markers and info windows
      markersRef.current.forEach(marker => marker.setMap(null));
      infoWindowsRef.current.forEach(window => window.close());
      markersRef.current = [];
      infoWindowsRef.current = [];

      battles.forEach(battle => {
        // Skip if battle doesn't have coordinates
        if (battle.latitude == null || battle.longitude == null) return;

        const coordinates = {
          lat: battle.latitude,
          lng: battle.longitude
        };

        const marker = new google.maps.Marker({
          map: mapInstance.current,
          position: coordinates,
          title: language === 'ar' ? battle.name : battle.nameTransliterated || battle.name,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            fillColor: '#ec4899',
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 8,
          },
          label: {
            text: language === 'ar' ? battle.name : battle.nameTransliterated || battle.name,
            color: '#000', // any CSS color
            fontSize: '14px',
            fontWeight: 'bold', // optional
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2 max-w-xs">
              <h3 class="font-bold text-amber-600 dark:text-amber-400">
                ${language === 'ar' ? battle.name : battle.nameTransliterated || battle.name}
              </h3>
              ${battle.hijriYear ? `
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  ${battle.hijriYear} ${language === 'ar' ? 'هـ' : 'AH'}
                </p>
              ` : ''}
              <p class="text-sm text-gray-700 dark:text-gray-200 mt-1">
                ${battle.location ? (language === 'ar' ? battle.location : battle.locationEn || battle.location) : ''}
              </p>
              <a href="/battles/${battle.slug}" 
                 class="inline-block mt-2 text-sm text-amber-600 dark:text-amber-400 hover:underline">
                ${language === 'ar' ? 'عرض التفاصيل' : 'View details'}
              </a>
            </div>
          `,
        });

        marker.addListener('click', () => {
          // Close all other info windows
          infoWindowsRef.current.forEach(window => window.close());
          infoWindow.open(mapInstance.current, marker);
        });

        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
      });
    };



    initMap();

    // Clean up
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      infoWindowsRef.current.forEach(window => window.close());
    };
  }, [battles, defaultCenter, defaultZoom, language]);

  return <div ref={mapRef} className={className} />;
};

export default BattleMap;
