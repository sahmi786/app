import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { utcToZonedTime } from 'date-fns-tz';
import { colors, defaultClocks } from '../lib/theme';

const ClockFace = ({ hours, minutes, size = 80 }) => {
  // Calculate hand rotations
  const hourRotation = ((hours % 12) + minutes / 60) * 30; // 30 degrees per hour
  const minuteRotation = minutes * 6; // 6 degrees per minute

  const handLength = {
    hour: size * 0.25,
    minute: size * 0.35,
  };

  return (
    <View style={[styles.clockFace, { width: size, height: size, borderRadius: size / 2 }]}>
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const rotation = i * 30;
        const isMainHour = i % 3 === 0;
        return (
          <View
            key={i}
            style={[
              styles.hourMarker,
              {
                height: isMainHour ? 8 : 4,
                width: isMainHour ? 2 : 1,
                top: 4,
                left: size / 2 - (isMainHour ? 1 : 0.5),
                transform: [
                  { translateY: size / 2 - 4 },
                  { rotate: `${rotation}deg` },
                  { translateY: -(size / 2 - 4) },
                ],
              },
            ]}
          />
        );
      })}
      
      {/* Center dot */}
      <View style={styles.centerDot} />
      
      {/* Hour hand */}
      <View
        style={[
          styles.hand,
          styles.hourHand,
          {
            height: handLength.hour,
            left: size / 2 - 2,
            top: size / 2 - handLength.hour,
            transformOrigin: 'bottom',
            transform: [{ rotate: `${hourRotation}deg` }],
          },
        ]}
      />
      
      {/* Minute hand */}
      <View
        style={[
          styles.hand,
          styles.minuteHand,
          {
            height: handLength.minute,
            left: size / 2 - 1.5,
            top: size / 2 - handLength.minute,
            transformOrigin: 'bottom',
            transform: [{ rotate: `${minuteRotation}deg` }],
          },
        ]}
      />
    </View>
  );
};

const WorldClocks = ({ clocks = defaultClocks, compact = false }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeInZone = (timezone) => {
    try {
      const zonedTime = utcToZonedTime(time, timezone);
      return {
        hours: zonedTime.getHours(),
        minutes: zonedTime.getMinutes(),
      };
    } catch (error) {
      return { hours: 0, minutes: 0 };
    }
  };

  const clockSize = compact ? 60 : 80;

  return (
    <View style={styles.container}>
      {clocks.map((clock) => {
        const { hours, minutes } = getTimeInZone(clock.timezone);
        return (
          <View key={clock.id} style={[styles.clock, compact && styles.clockCompact]}>
            <ClockFace hours={hours} minutes={minutes} size={clockSize} />
            <Text style={[styles.city, compact && styles.cityCompact]}>
              {clock.city}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  clock: {
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
  },
  clockCompact: {
    padding: 8,
  },
  clockFace: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: colors.primary,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hourMarker: {
    position: 'absolute',
    backgroundColor: colors.text.secondary,
  },
  centerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    top: '50%',
    left: '50%',
    marginTop: -4,
    marginLeft: -4,
    zIndex: 10,
  },
  hand: {
    position: 'absolute',
    borderRadius: 2,
  },
  hourHand: {
    width: 4,
    backgroundColor: colors.primary,
  },
  minuteHand: {
    width: 3,
    backgroundColor: colors.secondary,
  },
  city: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 10,
  },
  cityCompact: {
    fontSize: 11,
  },
});

export default WorldClocks;
