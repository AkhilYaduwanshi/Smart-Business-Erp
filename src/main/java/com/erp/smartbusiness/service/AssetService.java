package com.erp.smartbusiness.service;

import com.erp.smartbusiness.dto.AssetRequest;
import com.erp.smartbusiness.entity.Asset;
import com.erp.smartbusiness.entity.Employee;
import com.erp.smartbusiness.exception.ResourceNotFoundException;
import com.erp.smartbusiness.repository.AssetRepository;
import com.erp.smartbusiness.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;

    public AssetService(
            AssetRepository assetRepository,
            EmployeeRepository employeeRepository
    ) {
        this.assetRepository = assetRepository;
        this.employeeRepository = employeeRepository;
    }

    // Create Asset
    public Asset createAsset(AssetRequest request) {

        if (assetRepository.existsByAssetCode(request.getAssetCode())) {
            throw new RuntimeException("Asset code already exists");
        }

        if (request.getSerialNumber() != null
                && !request.getSerialNumber().isBlank()
                && assetRepository.existsBySerialNumber(
                request.getSerialNumber()
        )) {

            throw new RuntimeException("Serial number already exists");
        }

        Asset asset = new Asset();

        asset.setAssetCode(request.getAssetCode());
        asset.setAssetName(request.getAssetName());
        asset.setAssetType(request.getAssetType());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setPurchasePrice(request.getPurchasePrice());
        asset.setStatus(request.getStatus());

        if (request.getAssignedToId() != null) {

            Employee employee = employeeRepository.findById(
                    request.getAssignedToId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Employee not found with id: "
                                    + request.getAssignedToId()
                    )
            );

            asset.setAssignedTo(employee);
        }

        return assetRepository.save(asset);
    }

    // Get All Assets / Filter By Status
    public List<Asset> getAllAssets(String status) {

        if (status == null || status.isBlank()) {
            return assetRepository.findAll();
        }

        return assetRepository.findByStatus(status);
    }

    // Get Asset By ID
    public Asset getAssetById(Long id) {

        return assetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Asset not found with id: " + id
                        )
                );
    }

    // Update Asset
    public Asset updateAsset(Long id, AssetRequest request) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Asset not found with id: " + id
                        )
                );

        if (!asset.getAssetCode().equals(request.getAssetCode())
                && assetRepository.existsByAssetCode(
                request.getAssetCode()
        )) {

            throw new RuntimeException("Asset code already exists");
        }

        if (request.getSerialNumber() != null
                && !request.getSerialNumber().isBlank()
                && !request.getSerialNumber().equals(
                asset.getSerialNumber()
        )
                && assetRepository.existsBySerialNumber(
                request.getSerialNumber()
        )) {

            throw new RuntimeException("Serial number already exists");
        }

        asset.setAssetCode(request.getAssetCode());
        asset.setAssetName(request.getAssetName());
        asset.setAssetType(request.getAssetType());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setPurchasePrice(request.getPurchasePrice());
        asset.setStatus(request.getStatus());

        if (request.getAssignedToId() != null) {

            Employee employee = employeeRepository.findById(
                    request.getAssignedToId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Employee not found with id: "
                                    + request.getAssignedToId()
                    )
            );

            asset.setAssignedTo(employee);

        } else {
            asset.setAssignedTo(null);
        }

        return assetRepository.save(asset);
    }

    // Delete Asset
    public void deleteAsset(Long id) {

        if (!assetRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Asset not found with id: " + id
            );
        }

        assetRepository.deleteById(id);
    }
}