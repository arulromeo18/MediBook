#!/bin/bash
# Hospital Appointment System - MongoDB Import Script
# Run this script from the database/ directory
# Prerequisites: MongoDB running on localhost:27017

DB="hospitaldb"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Importing Hospital Appointment System data into MongoDB..."

mongoimport --db $DB --collection hospitals --file "$DIR/hospitals.json" --jsonArray --drop
mongoimport --db $DB --collection doctors   --file "$DIR/doctors.json"   --jsonArray --drop
mongoimport --db $DB --collection patients  --file "$DIR/patients.json"  --jsonArray --drop

echo ""
echo "Creating indexes..."

mongosh $DB --eval "
  db.hospitals.createIndex({ city: 1 });
  db.doctors.createIndex({ hospitalId: 1 });
  db.patients.createIndex({ email: 1 }, { unique: true });
  db.appointments.createIndex({ doctorId: 1, appointmentDate: 1, appointmentTime: 1 }, { unique: true });
  db.appointments.createIndex({ patientId: 1 });
  db.appointments.createIndex({ patientEmail: 1 });
  db.appointments.createIndex({ appointmentDate: 1 });
  print('Indexes created successfully.');
"

echo ""
echo "Import complete!"
echo ""
echo "Default credentials:"
echo "  Admin:   admin@hospital.com    / password123"
echo "  Patient: arjun.sharma@gmail.com / password123"
