const { json } = require('body-parser');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;


const getAllRecords = async(req, res) => {
    const result = await mongodb.getDatabase().db().collection('medical-records').find();
    result.toArray().then((lists, err) => {
        if (err) {
            res.status(400).json({message:err});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });
};

const getSingleRecords = async(req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to select medical records.');
    }
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('medical-records').find({_id: userId});
    result.toArray().then((result, err) => {
        if (err) {
            res.status(400).json({message:err});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);
    });
};

const createRecords = async(req, res) => {
    const user = {
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        address: req.body.address,
        phone_number: req.body.phone_number,
        medical_history: [
            {
              date: req.body.date,
              diagnosis: req.body.diagnosis,
              prescriptions: [req.body.prescriptions],
              notes: req.body.notes,
              medical_records_id: req.body.medical_records_id
            }
        ],
        appointment: [
            {
                date: req.body.date,
                doctor_id: req.body.doctor_id,
                patient_id: req.body.patient_id,
                reason: req.body.reason,
                status: req.body.status,
                appointment_id: req.body.appointment_id
            }
        ]
    };
    const response = await mongodb.getDatabase().db().collection('medical-records').insertOne(user);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the medical records.')
    };
};

const updateRecords = async(req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to update the medical records.');
    }

    const userId = new ObjectId(req.params.id);
    const user = {
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        address: req.body.address,
        phone_number: req.body.phone_number,
        medical_records: req.body.medical_records,
        appointment: req.body.appointment
    };

    for (const medicalRecord of req.body.medical_records) {
        await mongodb.getDatabase().db().collection('medical_records').updateMany(
            { _id: medicalRecord._id },
            { $set: { ...medicalRecord } }
        );
    }

    for (const appointment of req.body.appointment) {
        await mongodb.getDatabase().db().collection('appointment').updateMany(
            { _id: appointment._id },
            { $set: { ...appointment } }
        );
    }
    
    const response = await mongodb.getDatabase().db().collection('medical-records').replaceOne({_id:userId}, user);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the medical records.')
    };
};



const deleteRecords = async(req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to delete the medical records.');
    }
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('medical-records').remove({_id:userId}, true);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the medical records.')
    };
};



module.exports = {
    getAllRecords,
    getSingleRecords,
    createRecords,
    updateRecords,
    deleteRecords
};