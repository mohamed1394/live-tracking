package com.example.live.model;

public class CoordinateMessage {
    private String agentId;
    private double lat;
    private double lng;
    private long timestamp;

    public CoordinateMessage() {
    }

    public CoordinateMessage(String agentId, double lat, double lng, long timestamp) {
        this.agentId = agentId;
        this.lat = lat;
        this.lng = lng;
        this.timestamp = timestamp;
    }

    public String getAgentId() {
        return agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}

