package com.erp.smartbusiness.controller;

import com.erp.smartbusiness.dto.AssetRequest;
import com.erp.smartbusiness.entity.Asset;
import com.erp.smartbusiness.service.AssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@Tag(
        name = "Asset Management",
        description = "APIs for company asset creation, assignment, filtering and management"
)
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    // CREATE
    @PostMapping
    @Operation(
            summary = "Create Asset",
            description = "Create a new company asset and optionally assign it to an employee"
    )
    public ResponseEntity<Asset> createAsset(
            @Valid @RequestBody AssetRequest request) {

        return ResponseEntity.ok(
                assetService.createAsset(request)
        );
    }

    // GET ALL / FILTER BY STATUS
    @GetMapping
    @Operation(
            summary = "Get Assets",
            description = "Get all assets or filter assets by status"
    )
    public ResponseEntity<List<Asset>> getAllAssets(
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(
                assetService.getAllAssets(status)
        );
    }

    // GET BY ID
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Asset By ID",
            description = "Get asset details using asset ID"
    )
    public ResponseEntity<Asset> getAssetById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assetService.getAssetById(id)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    @Operation(
            summary = "Update Asset",
            description = "Update asset details and employee assignment"
    )
    public ResponseEntity<Asset> updateAsset(
            @PathVariable Long id,
            @Valid @RequestBody AssetRequest request) {

        return ResponseEntity.ok(
                assetService.updateAsset(id, request)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete Asset",
            description = "Delete an existing company asset"
    )
    public ResponseEntity<Void> deleteAsset(
            @PathVariable Long id) {

        assetService.deleteAsset(id);

        return ResponseEntity.noContent().build();
    }
}